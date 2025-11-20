import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CreditSimulation } from '../../types/database';
import { Calculator, Eye, Trash2 } from 'lucide-react';

interface SimulationListProps {
  onViewDetails: (simulationId: string) => void;
}

export function SimulationList({ onViewDetails }: SimulationListProps) {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimulations();
  }, [user]);

  const loadSimulations = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_simulations')
        .select(
          `
          *,
          clients (full_name, document_number),
          property_units (property_name, unit_number, address)
        `
        )
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSimulations(data || []);
    } catch (error) {
      console.error('Error loading simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSimulation = async (simulationId: string, clientName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la simulación del cliente ${clientName}?`)) {
      return;
    }

    try {
      // Eliminar payment_schedules primero
      await supabase
        .from('payment_schedules')
        .delete()
        .eq('simulation_id', simulationId);

      // Eliminar la simulación
      const { error } = await supabase
        .from('credit_simulations')
        .delete()
        .eq('id', simulationId);

      if (error) throw error;
      
      // Recargar la lista de simulaciones
      await loadSimulations();
    } catch (error) {
      console.error('Error deleting simulation:', error);
      alert('Error al eliminar la simulación. Por favor, intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="text-center py-12">
        <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay simulaciones</h3>
        <p className="text-gray-500">Crea tu primera simulación de crédito</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {simulations.map((sim) => {
        const currencySymbol = sim.currency === 'PEN' ? 'S/' : '$';

        return (
          <div
            key={sim.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative"
          >
            {/* Botón de eliminar en la esquina superior derecha */}
            <button
              onClick={() => handleDeleteSimulation(sim.id, sim.clients?.full_name || 'cliente')}
              className="absolute top-4 right-4 z-10 p-2 text-white hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors backdrop-blur-sm"
              title="Eliminar simulación"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* Header con icono */}
            <div className="bg-blue-600 h-24 flex items-center justify-center relative">
              <Calculator className="w-12 h-12 text-white opacity-80" />
            </div>

            <div className="p-6">
              {/* Información principal */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {sim.clients?.full_name || 'Cliente no disponible'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {sim.property_units?.property_name || 'Propiedad no disponible'}
                </p>
                <p className="text-xs text-gray-500">
                  {sim.property_units?.unit_number || ''} • {new Date(sim.created_at).toLocaleDateString('es-PE')}
                </p>
              </div>

              {/* Información financiera */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Monto del Préstamo</span>
                  <span className="font-semibold text-gray-900">
                    {currencySymbol}{' '}
                    {sim.loan_amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Plazo</span>
                  <span className="font-semibold text-gray-900">{sim.loan_term_years} años</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">TEA</span>
                  <span className="font-semibold text-green-600">
                    {((sim.tea || 0) * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">TCEA</span>
                  <span className="font-semibold text-orange-600">
                    {((sim.tcea || 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Botón ver detalle */}
              <button
                onClick={() => onViewDetails(sim.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver Detalle
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
