import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { PropertyUnit } from '../../types/database';
import { Home, MapPin, Ruler } from 'lucide-react';
import { getDistrictImage } from '../../utils/districtImages';

export function PropertyList() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyUnit[]>([]);
  const [assignedPropertyIds, setAssignedPropertyIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [user]);

  const loadProperties = async () => {
    try {
      const [propertiesResult, simulationsResult] = await Promise.all([
        supabase
          .from('property_units')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('credit_simulations')
          .select('property_id')
          .eq('user_id', user?.id),
      ]);

      if (propertiesResult.error) throw propertiesResult.error;
      if (simulationsResult.error) throw simulationsResult.error;

      setProperties(propertiesResult.data || []);
      
      // Crear un Set con los IDs de propiedades que tienen simulaciones (asignadas)
      const assignedIds = new Set(
        (simulationsResult.data || []).map((sim) => sim.property_id)
      );
      setAssignedPropertyIds(assignedIds);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Departamento',
      house: 'Casa',
      duplex: 'Dúplex',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string, propertyId: string) => {
    // Si la propiedad está asignada a un cliente (tiene simulación), mostrar "No disponible"
    if (assignedPropertyIds.has(propertyId)) {
      return (
        <span className="px-3 py-1.5 rounded-full text-sm font-semibold border-2 bg-red-500 text-white border-red-600 shadow-sm">
          No disponible
        </span>
      );
    }

    const styles: Record<string, string> = {
      available: 'bg-green-500 text-white border-green-600',
      reserved: 'bg-yellow-500 text-white border-yellow-600',
      sold: 'bg-gray-500 text-white border-gray-600',
    };

    const labels: Record<string, string> = {
      available: 'Disponible',
      reserved: 'Reservado',
      sold: 'Vendido',
    };

    return (
      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${styles[status]} shadow-sm`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades registradas</h3>
        <p className="text-gray-500">Comienza agregando tu primera propiedad</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="bg-blue-600 h-32 flex items-center justify-center relative overflow-hidden">
            {(() => {
              const districtImage = getDistrictImage(
                property.district,
                property.province,
                property.department
              );

              if (districtImage) {
                // Mostrar imagen del distrito
                return (
                  <img
                    src={districtImage}
                    alt={property.district || 'Distrito'}
                    className="w-full h-full object-cover"
                  />
                );
              } else {
                // Mostrar icono por defecto
                return <Home className="w-16 h-16 text-white opacity-50" />;
              }
            })()}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{property.property_name}</h3>
                <p className="text-sm text-gray-500">{property.unit_number}</p>
              </div>
              {getStatusBadge(property.status, property.id)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">
                  {property.address}, {property.district}, {property.province}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Ruler className="w-4 h-4" />
                <span>{property.total_area} m²</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Precio</p>
                  <p className="text-lg font-bold text-gray-900">
                    {property.currency === 'PEN' ? 'S/' : '$'}{' '}
                    {property.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Tipo</p>
                  <p className="text-sm font-medium text-gray-900">
                    {getPropertyTypeLabel(property.property_type)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
