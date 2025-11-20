import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Client } from '../../types/database';
import { User, Mail, Phone, DollarSign, Trash2, Edit } from 'lucide-react';
import { getClientColor } from '../../utils/clientColors';
import { getDistrictImage } from '../../utils/districtImages';
import { ClientForm } from './ClientForm';

export function ClientList() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    loadClients();
  }, [user]);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al cliente ${clientName}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      
      // Recargar la lista de clientes
      await loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error al eliminar el cliente. Por favor, intenta nuevamente.');
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingClient(null);
    loadClients();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const getMaritalStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      single: 'Soltero(a)',
      married: 'Casado(a)',
      divorced: 'Divorciado(a)',
      widowed: 'Viudo(a)',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes registrados</h3>
        <p className="text-gray-500">Comienza agregando tu primer cliente</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative"
          >
            {/* Botones de acción en la esquina superior derecha */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleEditClient(client)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar cliente"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteClient(client.id, client.full_name)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar cliente"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

          <div className="flex items-center gap-6">
            {/* Avatar o Imagen del Distrito */}
            <div className="flex-shrink-0">
              {(() => {
                const districtImage = getDistrictImage(
                  client.district,
                  client.province,
                  client.department
                );

                if (districtImage) {
                  // Mostrar imagen del distrito
                  return (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={districtImage}
                        alt={client.district || 'Distrito'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                } else {
                  // Mostrar avatar con color
                  const colorScheme = getClientColor(client.id, client.color);
                  return (
                    <div className={`w-16 h-16 ${colorScheme.light} rounded-full flex items-center justify-center`}>
                      <User className={`w-8 h-8 ${colorScheme.text}`} />
                    </div>
                  );
                }
              })()}
            </div>

            {/* Información principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{client.full_name}</h3>
                  <p className="text-sm text-gray-500">
                    {client.document_type}: {client.document_number}
                  </p>
                </div>
              </div>

              {/* Información en formato horizontal */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 truncate">{client.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-sm text-gray-900">{client.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Ingreso Mensual</p>
                    <p className="text-sm text-gray-900 font-medium">
                      S/ {client.monthly_income.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Estado Civil</p>
                    <p className="text-sm text-gray-900">{getMaritalStatusLabel(client.marital_status)}</p>
                  </div>
                </div>
              </div>

              {/* Información adicional en segunda fila horizontal */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Dependientes: </span>
                    <span className="font-medium text-gray-900">{client.dependents}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ClientForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          client={editingClient}
        />
      )}
    </>
  );
}
