import { useState } from 'react';
import { SimulationList } from '../components/simulations/SimulationList';
import { SimulationForm } from '../components/simulations/SimulationForm';
import { SimulationDetail } from '../components/simulations/SimulationDetail';
import { Calculator } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function SimulationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSimulationId, setSelectedSimulationId] = useState<string | null>(null);
  const [editingSimulationId, setEditingSimulationId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [simulationToEdit, setSimulationToEdit] = useState<any>(null);

  const handleSuccess = (simulationId: string) => {
    setRefreshKey((prev) => prev + 1);
    setSelectedSimulationId(simulationId);
    setEditingSimulationId(null);
    setSimulationToEdit(null);
  };

  const handleEdit = async (simulationId: string) => {
    try {
      const { data, error } = await supabase
        .from('credit_simulations')
        .select('*')
        .eq('id', simulationId)
        .single();

      if (error) throw error;
      setSimulationToEdit(data);
      setEditingSimulationId(simulationId);
      setShowForm(true);
    } catch (error) {
      console.error('Error loading simulation for edit:', error);
      alert('Error al cargar la simulación para editar');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulaciones de Crédito</h1>
          <p className="text-gray-600 mt-1">Gestiona y analiza tus simulaciones hipotecarias</p>
        </div>
        <button
          onClick={() => {
            setSimulationToEdit(null);
            setEditingSimulationId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calculator className="w-5 h-5" />
          Nueva Simulación
        </button>
      </div>

      <div key={refreshKey}>
        <SimulationList
          onViewDetails={(id) => setSelectedSimulationId(id)}
          onEdit={handleEdit}
        />
      </div>

      {showForm && (
        <SimulationForm
          onClose={() => {
            setShowForm(false);
            setSimulationToEdit(null);
            setEditingSimulationId(null);
          }}
          onSuccess={handleSuccess}
          simulation={simulationToEdit}
        />
      )}

      {selectedSimulationId && (
        <SimulationDetail
          simulationId={selectedSimulationId}
          onClose={() => setSelectedSimulationId(null)}
        />
      )}
    </div>
  );
}
