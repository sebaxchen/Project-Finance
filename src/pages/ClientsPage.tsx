import { useState } from 'react';
import { ClientList } from '../components/clients/ClientList';
import { ClientForm } from '../components/clients/ClientForm';
import { UserPlus, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function ClientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [creatingSample, setCreatingSample] = useState(false);
  const { user } = useAuth();

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const createSampleClient = async () => {
    if (!user?.id) {
      alert('Debes estar autenticado para crear un cliente');
      return;
    }

    setCreatingSample(true);
    try {
      const sampleClient = {
        document_type: 'DNI',
        document_number: '12345678',
        full_name: 'Juan Pérez García',
        email: 'juan.perez@example.com',
        phone: '987654321',
        marital_status: 'married',
        dependents: 2,
        monthly_income: 5000,
        user_id: user.id,
      };

      const { error } = await supabase.from('clients').insert(sampleClient);

      if (error) throw error;

      alert('✅ Cliente de ejemplo creado exitosamente!');
      handleSuccess();
    } catch (error: any) {
      console.error('Error al crear cliente de ejemplo:', error);
      alert('Error al crear cliente: ' + (error.message || 'Error desconocido'));
    } finally {
      setCreatingSample(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Gestiona tu cartera de clientes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={createSampleClient}
            disabled={creatingSample}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Crear cliente de ejemplo para pruebas"
          >
            <Sparkles className="w-5 h-5" />
            {creatingSample ? 'Creando...' : 'Cliente Ejemplo'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      <div key={refreshKey}>
        <ClientList />
      </div>

      {showForm && (
        <ClientForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
