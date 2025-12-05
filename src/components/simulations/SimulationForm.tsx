import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Client, PropertyUnit, CreditSimulation } from '../../types/database';
import { X } from 'lucide-react';
import { calculateCreditSchedule } from '../../utils/creditCalculations';

interface SimulationFormProps {
  onClose: () => void;
  onSuccess: (simulationId: string) => void;
  simulation?: CreditSimulation | null; // Simulación a editar (opcional)
}

export function SimulationForm({ onClose, onSuccess, simulation }: SimulationFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!simulation;

  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<PropertyUnit[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyUnit | null>(null);

  const [formData, setFormData] = useState({
    client_id: '',
    property_id: '',
    initial_payment: 0,
    techo_propio_bonus: 0,
    interest_rate_type: 'effective' as 'nominal' | 'effective',
    annual_interest_rate: 0.08,
    capitalization: 'monthly',
    loan_term_years: 20,
    grace_period_type: 'none' as 'none' | 'total' | 'partial',
    grace_period_months: 0,
    insurance_rate: 0.0033, // Tasa fija: 0.33% anual (incluye Seguro de Desgravamen + Seguro del Bien) - No visible para el usuario
  });

  useEffect(() => {
    loadClientsAndProperties();
  }, [user]);

  // Cargar datos de la simulación si se está editando
  useEffect(() => {
    if (simulation) {
      setFormData({
        client_id: simulation.client_id,
        property_id: simulation.property_id,
        initial_payment: simulation.initial_payment,
        techo_propio_bonus: simulation.techo_propio_bonus,
        interest_rate_type: simulation.interest_rate_type,
        annual_interest_rate: simulation.annual_interest_rate,
        capitalization: simulation.capitalization || 'monthly',
        loan_term_years: simulation.loan_term_years,
        grace_period_type: simulation.grace_period_type,
        grace_period_months: simulation.grace_period_months,
        insurance_rate: 0.0033, // Siempre usar tasa fija de 0.33% anual
      });
    }
  }, [simulation]);

  const loadClientsAndProperties = async () => {
    try {
      const [clientsResult, propertiesResult] = await Promise.all([
        supabase.from('clients').select('*').eq('user_id', user?.id),
        supabase
          .from('property_units')
          .select('*')
          .eq('user_id', user?.id)
          .eq('status', 'available'),
      ]);

      if (clientsResult.error) throw clientsResult.error;
      if (propertiesResult.error) throw propertiesResult.error;

      setClients(clientsResult.data || []);
      const props = propertiesResult.data || [];
      setProperties(props);

      // Si estamos editando, seleccionar la propiedad de la simulación
      if (simulation) {
        const prop = props.find((p) => p.id === simulation.property_id);
        if (prop) {
          setSelectedProperty(prop);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    setSelectedProperty(property || null);
    setFormData((prev) => ({ ...prev, property_id: propertyId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!selectedProperty) throw new Error('Selecciona una propiedad');

      const property_price = selectedProperty.price;
      
      // Validar que el bono de techo propio no sea negativo
      if (formData.techo_propio_bonus < 0) {
        throw new Error('El bono de techo propio no puede ser negativo');
      }
      
      // Validar que la suma de cuota inicial y bono no exceda el precio de la propiedad
      const total_discount = formData.initial_payment + formData.techo_propio_bonus;
      if (total_discount > property_price) {
        throw new Error('La suma de la cuota inicial y el bono de techo propio no puede exceder el precio de la propiedad');
      }
      
      const loan_amount = property_price - total_discount;

      if (loan_amount <= 0) {
        throw new Error('El monto del préstamo debe ser mayor a 0. Ajusta la cuota inicial o el bono de techo propio.');
      }

      const calculationResult = calculateCreditSchedule({
        loan_amount,
        annual_interest_rate: formData.annual_interest_rate,
        interest_rate_type: formData.interest_rate_type,
        capitalization:
          formData.interest_rate_type === 'nominal'
            ? (formData.capitalization as any)
            : undefined,
        loan_term_years: formData.loan_term_years,
        grace_period_type: formData.grace_period_type,
        grace_period_months: formData.grace_period_months,
        insurance_rate: 0.0033, // Tasa fija: 0.33% anual (Seguro de Desgravamen + Seguro del Bien)
      });

      if (isEditing && simulation) {
        // Actualizar simulación existente
        const { data: simulationData, error: simulationError } = await supabase
          .from('credit_simulations')
          .update({
            client_id: formData.client_id,
            property_id: formData.property_id,
            property_price,
            initial_payment: formData.initial_payment,
            loan_amount,
            techo_propio_bonus: formData.techo_propio_bonus,
            currency: selectedProperty.currency,
            interest_rate_type: formData.interest_rate_type,
            annual_interest_rate: formData.annual_interest_rate,
            capitalization:
              formData.interest_rate_type === 'nominal' ? formData.capitalization : null,
            loan_term_years: formData.loan_term_years,
            grace_period_type: formData.grace_period_type,
            grace_period_months: formData.grace_period_months,
            insurance_rate: 0.0033, // Tasa fija: 0.33% anual
            van: calculationResult.van,
            tir: calculationResult.tir,
            tea: calculationResult.tea,
            tcea: calculationResult.tcea,
            updated_at: new Date().toISOString(),
          })
          .eq('id', simulation.id)
          .select()
          .single();

        if (simulationError) throw simulationError;

        // Eliminar cronograma anterior
        await supabase
          .from('payment_schedules')
          .delete()
          .eq('simulation_id', simulation.id);

        // Insertar nuevo cronograma
        const scheduleInserts = calculationResult.payment_schedule.map((item) => ({
          simulation_id: simulation.id,
          ...item,
        }));

        console.log('Inserting updated payment schedule:', {
          simulationId: simulation.id,
          scheduleCount: scheduleInserts.length,
        });

        const { error: scheduleError, data: insertedSchedule } = await supabase
          .from('payment_schedules')
          .insert(scheduleInserts);

        if (scheduleError) {
          console.error('Error inserting updated schedule:', scheduleError);
          throw scheduleError;
        }

        console.log('Updated payment schedule inserted successfully');

        // Cerrar y notificar éxito
        setLoading(false);
        onClose();
        setTimeout(() => {
          onSuccess(simulation.id);
        }, 0);
      } else {
        // Crear nueva simulación
        const { data: simulationData, error: simulationError } = await supabase
          .from('credit_simulations')
          .insert({
            user_id: user?.id,
            client_id: formData.client_id,
            property_id: formData.property_id,
            property_price,
            initial_payment: formData.initial_payment,
            loan_amount,
            techo_propio_bonus: formData.techo_propio_bonus,
            currency: selectedProperty.currency,
            interest_rate_type: formData.interest_rate_type,
            annual_interest_rate: formData.annual_interest_rate,
            capitalization:
              formData.interest_rate_type === 'nominal' ? formData.capitalization : null,
            loan_term_years: formData.loan_term_years,
            grace_period_type: formData.grace_period_type,
            grace_period_months: formData.grace_period_months,
            insurance_rate: 0.0033, // Tasa fija: 0.33% anual
            van: calculationResult.van,
            tir: calculationResult.tir,
            tea: calculationResult.tea,
            tcea: calculationResult.tcea,
          })
          .select()
          .single();

        if (simulationError) throw simulationError;

        const scheduleInserts = calculationResult.payment_schedule.map((item) => ({
          simulation_id: simulationData.id,
          ...item,
        }));

        console.log('Inserting payment schedule:', {
          simulationId: simulationData.id,
          scheduleCount: scheduleInserts.length,
          firstPayment: scheduleInserts[0],
        });

        const { error: scheduleError, data: insertedSchedule } = await supabase
          .from('payment_schedules')
          .insert(scheduleInserts);

        if (scheduleError) {
          console.error('Error inserting schedule:', scheduleError);
          throw scheduleError;
        }

        console.log('Payment schedule inserted successfully:', {
          insertedCount: insertedSchedule?.length || scheduleInserts.length,
        });

        // Cerrar y notificar éxito
        setLoading(false);
        onClose();
        setTimeout(() => {
          onSuccess(simulationData.id);
        }, 0);
      }

    } catch (err: any) {
      setError(err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} simulación`);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        'initial_payment',
        'techo_propio_bonus',
        'annual_interest_rate',
        'loan_term_years',
        'grace_period_months',
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const loanAmount = selectedProperty
    ? selectedProperty.price - formData.initial_payment - formData.techo_propio_bonus
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Simulación de Crédito' : 'Nueva Simulación de Crédito'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.full_name} - {client.document_number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad</label>
              <select
                name="property_id"
                value={formData.property_id}
                onChange={(e) => handlePropertyChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar propiedad</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.property_name} - {property.unit_number} (
                    {property.currency === 'PEN' ? 'S/' : '$'}{' '}
                    {property.price.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedProperty && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Resumen de Financiamiento</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Precio de Propiedad</p>
                  <p className="font-semibold">
                    {selectedProperty.currency === 'PEN' ? 'S/' : '$'}{' '}
                    {selectedProperty.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">- Cuota Inicial</p>
                  <p className="font-semibold text-red-600">
                    - {selectedProperty.currency === 'PEN' ? 'S/' : '$'}{' '}
                    {formData.initial_payment.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                {formData.techo_propio_bonus > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">- Bono Techo Propio</p>
                    <p className="font-semibold text-yellow-600">
                      - {selectedProperty.currency === 'PEN' ? 'S/' : '$'}{' '}
                      {formData.techo_propio_bonus.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between items-center">
                  <p className="text-gray-700 font-semibold">Monto del Préstamo</p>
                  <p className="font-bold text-blue-600 text-base">
                    {selectedProperty.currency === 'PEN' ? 'S/' : '$'}{' '}
                    {loanAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuota Inicial</label>
              <input
                type="number"
                name="initial_payment"
                value={formData.initial_payment}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bono Techo Propio
              </label>
              <input
                type="number"
                name="techo_propio_bonus"
                value={formData.techo_propio_bonus}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Tasa</label>
              <select
                name="interest_rate_type"
                value={formData.interest_rate_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="effective">Efectiva</option>
                <option value="nominal">Nominal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tasa Anual (%)
              </label>
              <input
                type="number"
                name="annual_interest_rate"
                value={formData.annual_interest_rate * 100}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    annual_interest_rate: Number(e.target.value) / 100,
                  }))
                }
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {formData.interest_rate_type === 'nominal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capitalización
                </label>
                <select
                  name="capitalization"
                  value={formData.capitalization}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Mensual</option>
                  <option value="bimonthly">Bimestral</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="semiannual">Semestral</option>
                  <option value="annual">Anual</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (años)</label>
              <input
                type="number"
                name="loan_term_years"
                value={formData.loan_term_years}
                onChange={handleChange}
                min="1"
                max="30"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periodo de Gracia
              </label>
              <select
                name="grace_period_type"
                value={formData.grace_period_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">Sin periodo de gracia</option>
                <option value="total">Gracia Total</option>
                <option value="partial">Gracia Parcial</option>
              </select>
            </div>

            {formData.grace_period_type !== 'none' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meses de Gracia
                </label>
                <input
                  type="number"
                  name="grace_period_months"
                  value={formData.grace_period_months}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEditing
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEditing
                ? 'Actualizar Simulación'
                : 'Crear Simulación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
