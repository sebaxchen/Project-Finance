import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CreditSimulation, PaymentSchedule, Client, PropertyUnit } from '../../types/database';
import { X, TrendingUp, TrendingDown, DollarSign, User, Home, Calendar, Percent, FileText, RefreshCw } from 'lucide-react';
import { calculateCreditSchedule } from '../../utils/creditCalculations';

interface SimulationDetailProps {
  simulationId: string;
  onClose: () => void;
}

export function SimulationDetail({ simulationId, onClose }: SimulationDetailProps) {
  const [simulation, setSimulation] = useState<CreditSimulation | null>(null);
  const [schedule, setSchedule] = useState<PaymentSchedule[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [property, setProperty] = useState<PropertyUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const loadSimulationData = async () => {
    try {
      const { data: simData, error: simError } = await supabase
        .from('credit_simulations')
        .select('*')
        .eq('id', simulationId)
        .maybeSingle();

      if (simError) {
        console.error('Error loading simulation:', simError);
        setLoading(false);
        return;
      }

      if (!simData) {
        console.error('Simulation not found');
        setLoading(false);
        return;
      }

      setSimulation(simData);

      console.log('Loading schedule for simulation:', simulationId);
      
      const [scheduleResult, clientResult, propertyResult] = await Promise.all([
        supabase
          .from('payment_schedules')
          .select('*')
          .eq('simulation_id', simulationId),
        supabase.from('clients').select('*').eq('id', simData.client_id).maybeSingle(),
        supabase.from('property_units').select('*').eq('id', simData.property_id).maybeSingle(),
      ]);

      console.log('Schedule query result:', {
        hasError: !!scheduleResult.error,
        dataLength: scheduleResult.data?.length || 0,
        error: scheduleResult.error,
      });

      if (scheduleResult.error) {
        console.error('Error loading schedule:', scheduleResult.error);
        setSchedule([]);
      } else {
        const scheduleData = scheduleResult.data || [];
        // Asegurar que esté ordenado por period_number
        scheduleData.sort((a, b) => (a.period_number || 0) - (b.period_number || 0));
        setSchedule(scheduleData);
        
        // Si no hay cronograma pero hay simulación, regenerarlo automáticamente
        if (scheduleData.length === 0 && simData) {
          console.warn('No payment schedule found for simulation:', simulationId);
          console.log('Auto-regenerating schedule...');
          // Regenerar automáticamente sin mostrar el estado de "regenerando"
          try {
            const calculationResult = calculateCreditSchedule({
              loan_amount: simData.loan_amount,
              annual_interest_rate: simData.annual_interest_rate,
              interest_rate_type: simData.interest_rate_type,
              capitalization: simData.capitalization || undefined,
              loan_term_years: simData.loan_term_years,
              grace_period_type: simData.grace_period_type,
              grace_period_months: simData.grace_period_months,
              insurance_rate: simData.insurance_rate,
              start_date: new Date(simData.created_at),
            });

            // Insertar nuevo cronograma
            const scheduleInserts = calculationResult.payment_schedule.map((item) => ({
              simulation_id: simData.id,
              ...item,
            }));

            const { error: scheduleError } = await supabase
              .from('payment_schedules')
              .insert(scheduleInserts);

            if (scheduleError) {
              console.error('Error auto-regenerating schedule:', scheduleError);
            } else {
              console.log('Schedule auto-regenerated successfully');
              // Actualizar indicadores financieros
              const { error: updateError } = await supabase
                .from('credit_simulations')
                .update({
                  van: calculationResult.van,
                  tir: calculationResult.tir,
                  tea: calculationResult.tea,
                  tcea: calculationResult.tcea,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', simulationId);

              if (updateError) {
                console.error('Error updating simulation:', updateError);
              }
              
              // Recargar el cronograma
              const { data: newScheduleData, error: reloadError } = await supabase
                .from('payment_schedules')
                .select('*')
                .eq('simulation_id', simulationId);

              if (!reloadError && newScheduleData) {
                const sortedSchedule = newScheduleData.sort((a, b) => (a.period_number || 0) - (b.period_number || 0));
                setSchedule(sortedSchedule);
                // Actualizar la simulación con los nuevos valores
                setSimulation({
                  ...simData,
                  van: calculationResult.van,
                  tir: calculationResult.tir,
                  tea: calculationResult.tea,
                  tcea: calculationResult.tcea,
                });
              }
            }
          } catch (error) {
            console.error('Error in auto-regeneration:', error);
          }
        }
      }

      if (clientResult.error) {
        console.error('Error loading client:', clientResult.error);
      } else {
        setClient(clientResult.data);
      }

      if (propertyResult.error) {
        console.error('Error loading property:', propertyResult.error);
      } else {
        setProperty(propertyResult.data);
      }
    } catch (error) {
      console.error('Error loading simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSimulationData();
  }, [simulationId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Cargando simulación...</p>
        </div>
      </div>
    );
  }

  // Si no hay simulación, mostrar error
  if (!simulation) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">No se pudo cargar la simulación.</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // Si falta información del cliente o propiedad, mostrar advertencia pero continuar
  const hasIncompleteData = !client || !property;

  const currencySymbol = simulation.currency === 'PEN' ? 'S/' : '$';

  // Calcular totales del cronograma
  const totalInterest = schedule.reduce((sum, p) => sum + (p.interest_payment || 0), 0);
  const totalInsurance = schedule.reduce((sum, p) => sum + (p.insurance_payment || 0), 0);
  const totalPrincipal = schedule.reduce((sum, p) => sum + (p.principal_payment || 0), 0);
  const totalPaid = schedule.reduce((sum, p) => sum + (p.total_payment || 0), 0);

  // Formatear tasas con validación
  const formatRate = (rate: number | undefined | null): string => {
    if (rate === undefined || rate === null || !isFinite(rate) || isNaN(rate)) {
      return 'N/A';
    }
    if (rate < -1 || rate > 10) {
      return 'N/A';
    }
    return (rate * 100).toFixed(2) + '%';
  };

  const formatVAN = (van: number | undefined | null): string => {
    if (van === undefined || van === null || !isFinite(van) || isNaN(van)) {
      return 'N/A';
    }
    return `${currencySymbol} ${van.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  const regenerateSchedule = async () => {
    if (!simulation) return;
    
    setRegenerating(true);
    try {
      // Calcular nuevo cronograma
      const calculationResult = calculateCreditSchedule({
        loan_amount: simulation.loan_amount,
        annual_interest_rate: simulation.annual_interest_rate,
        interest_rate_type: simulation.interest_rate_type,
        capitalization: simulation.capitalization || undefined,
        loan_term_years: simulation.loan_term_years,
        grace_period_type: simulation.grace_period_type,
        grace_period_months: simulation.grace_period_months,
        insurance_rate: simulation.insurance_rate,
        start_date: new Date(simulation.created_at),
      });

      // Eliminar cronograma anterior
      await supabase
        .from('payment_schedules')
        .delete()
        .eq('simulation_id', simulationId);

      // Insertar nuevo cronograma
      const scheduleInserts = calculationResult.payment_schedule.map((item) => ({
        simulation_id: simulation.id,
        ...item,
      }));

      const { error: scheduleError } = await supabase
        .from('payment_schedules')
        .insert(scheduleInserts);

      if (scheduleError) throw scheduleError;

      // Actualizar indicadores financieros
      const { error: updateError } = await supabase
        .from('credit_simulations')
        .update({
          van: calculationResult.van,
          tir: calculationResult.tir,
          tea: calculationResult.tea,
          tcea: calculationResult.tcea,
          updated_at: new Date().toISOString(),
        })
        .eq('id', simulationId);

      if (updateError) {
        console.error('Error updating simulation:', updateError);
        throw updateError;
      }

      // Recargar datos
      await loadSimulationData();
    } catch (error) {
      console.error('Error regenerating schedule:', error);
      alert('Error al regenerar el cronograma. Por favor, intenta nuevamente.');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-[95vw] w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header fijo */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">Detalle de Simulación de Crédito</h2>
            <div className="flex flex-wrap gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span><strong>Cliente:</strong> {client?.full_name || 'No disponible'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span><strong>Propiedad:</strong> {property?.property_name || 'No disponible'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span><strong>Fecha:</strong> {new Date(simulation.created_at).toLocaleDateString('es-PE')}</span>
              </div>
            </div>
            {hasIncompleteData && (
              <p className="text-xs text-yellow-200 mt-2 bg-yellow-600/30 px-2 py-1 rounded inline-block">
                ⚠️ Algunos datos del cliente o propiedad no están disponibles
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 transition-colors p-2 rounded-lg ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-gray-50">
          {/* Tarjetas de indicadores principales */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <p className="text-xs font-medium text-gray-600 uppercase">Monto Préstamo</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {currencySymbol}{' '}
                {simulation.loan_amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-xs font-medium text-gray-600 uppercase">TEA</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatRate(simulation.tea)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <p className="text-xs font-medium text-gray-600 uppercase">TCEA</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatRate(simulation.tcea)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-purple-600" />
                <p className="text-xs font-medium text-gray-600 uppercase">TIR</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatRate(simulation.tir)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <p className="text-xs font-medium text-gray-600 uppercase">VAN</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatVAN(simulation.van)}
              </p>
            </div>
          </div>

          {/* Información detallada del crédito */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Información Detallada del Crédito
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border-l-2 border-blue-200 pl-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Precio de la Propiedad</p>
                <p className="text-lg font-bold text-gray-900">
                  {currencySymbol}{' '}
                  {simulation.property_price.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="border-l-2 border-green-200 pl-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Cuota Inicial</p>
                <p className="text-lg font-bold text-gray-900">
                  {currencySymbol}{' '}
                  {simulation.initial_payment.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="border-l-2 border-yellow-200 pl-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Bono Techo Propio</p>
                <p className="text-lg font-bold text-gray-900">
                  {currencySymbol}{' '}
                  {simulation.techo_propio_bonus.toLocaleString('es-PE', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="border-l-2 border-purple-200 pl-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Tasa de Interés Anual</p>
                <p className="text-lg font-bold text-gray-900">
                  {(simulation.annual_interest_rate * 100).toFixed(2)}%{' '}
                  <span className="text-sm font-normal text-gray-600">
                    ({simulation.interest_rate_type === 'nominal' ? 'Nominal' : 'Efectiva'}
                    {simulation.interest_rate_type === 'nominal' && simulation.capitalization
                      ? ` - ${simulation.capitalization}`
                      : ''})
                  </span>
                </p>
              </div>
              <div className="border-l-2 border-indigo-200 pl-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Plazo del Préstamo</p>
                <p className="text-lg font-bold text-gray-900">
                  {simulation.loan_term_years} años ({simulation.loan_term_years * 12} meses)
                </p>
              </div>
              <div className="border-l-2 border-red-200 pl-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Periodo de Gracia</p>
                <p className="text-lg font-bold text-gray-900">
                  {simulation.grace_period_type === 'none'
                    ? 'Sin período de gracia'
                    : `${simulation.grace_period_months} meses (${
                        simulation.grace_period_type === 'total' ? 'Total' : 'Parcial'
                      })`}
                </p>
              </div>
              <div className="border-l-2 border-teal-200 pl-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Tasa de Seguro Anual</p>
                <p className="text-lg font-bold text-gray-900">
                  {(simulation.insurance_rate * 100).toFixed(4)}%
                </p>
              </div>
              <div className="border-l-2 border-pink-200 pl-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Moneda</p>
                <p className="text-lg font-bold text-gray-900">
                  {simulation.currency === 'PEN' ? 'Soles Peruanos (PEN)' : 'Dólares Americanos (USD)'}
                </p>
              </div>
            </div>
          </div>

          {/* Resumen de pagos */}
          {schedule.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Pagos</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Capital Pagado</p>
                  <p className="text-xl font-bold text-blue-700">
                    {currencySymbol} {totalPrincipal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Intereses</p>
                  <p className="text-xl font-bold text-green-700">
                    {currencySymbol} {totalInterest.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Seguros</p>
                  <p className="text-xl font-bold text-yellow-700">
                    {currencySymbol} {totalInsurance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Pagado</p>
                  <p className="text-xl font-bold text-purple-700">
                    {currencySymbol} {totalPaid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cronograma de Pagos */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Cronograma de Pagos - Método Francés Vencido Ordinario
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {schedule.length} cuotas • Meses de 30 días • Año comercial de 360 días
              </p>
            </div>
            {schedule.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 inline-block max-w-md">
                  <Calendar className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <p className="text-yellow-800 font-bold text-lg mb-2">No hay cronograma de pagos disponible</p>
                  <p className="text-yellow-600 text-sm mb-4">
                    El cronograma se genera automáticamente al crear la simulación.
                  </p>
                  <button
                    onClick={regenerateSchedule}
                    disabled={regenerating}
                    className="flex items-center gap-2 mx-auto px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                    {regenerating ? 'Regenerando...' : 'Regenerar Cronograma'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold border-r border-gray-700">#</th>
                      <th className="px-4 py-3 text-left font-bold border-r border-gray-700">Fecha de Pago</th>
                      <th className="px-4 py-3 text-right font-bold border-r border-gray-700">Saldo Inicial</th>
                      <th className="px-4 py-3 text-right font-bold border-r border-gray-700">Amortización</th>
                      <th className="px-4 py-3 text-right font-bold border-r border-gray-700">Interés</th>
                      <th className="px-4 py-3 text-right font-bold border-r border-gray-700">Seguro</th>
                      <th className="px-4 py-3 text-right font-bold border-r border-gray-700 bg-blue-600">Cuota Total</th>
                      <th className="px-4 py-3 text-right font-bold">Saldo Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {schedule.map((payment, index) => (
                      <tr
                        key={payment.id}
                        className={`${
                          payment.grace_period
                            ? 'bg-yellow-50 hover:bg-yellow-100'
                            : index % 2 === 0
                            ? 'bg-white hover:bg-gray-50'
                            : 'bg-gray-50 hover:bg-gray-100'
                        } transition-colors`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-700">{payment.period_number}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {new Date(payment.payment_date).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-gray-700">
                          {currencySymbol}{' '}
                          {payment.beginning_balance.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-blue-700 font-semibold">
                          {currencySymbol}{' '}
                          {payment.principal_payment.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-green-700">
                          {currencySymbol}{' '}
                          {payment.interest_payment.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-orange-700">
                          {currencySymbol}{' '}
                          {payment.insurance_payment.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-bold font-mono text-blue-600 bg-blue-50">
                          {currencySymbol}{' '}
                          {payment.total_payment.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-gray-700">
                          {currencySymbol}{' '}
                          {payment.ending_balance.toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                    {/* Fila de totales */}
                    <tr className="bg-gray-800 text-white font-bold">
                      <td colSpan={3} className="px-4 py-3 text-right">TOTALES:</td>
                      <td className="px-4 py-3 text-right">
                        {currencySymbol} {totalPrincipal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {currencySymbol} {totalInterest.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {currencySymbol} {totalInsurance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right bg-blue-600">
                        {currencySymbol} {totalPaid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer fijo */}
        <div className="border-t bg-gray-50 p-4 flex justify-between items-center flex-shrink-0">
          <p className="text-sm text-gray-600">
            <strong>Nota:</strong> Cálculos basados en método francés vencido ordinario con meses de 30 días según normas del Fondo MiVivienda
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
