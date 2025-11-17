import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Building2,
  Calculator,
  TrendingUp,
  Shield,
  DollarSign,
  FileText,
  CheckCircle2,
  Award,
  Globe,
  Scale,
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    properties: 0,
    simulations: 0,
    availableProperties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const [clientsResult, propertiesResult, simulationsResult, availableResult] =
        await Promise.all([
          supabase
            .from('clients')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user?.id),
          supabase
            .from('property_units')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user?.id),
          supabase
            .from('credit_simulations')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user?.id),
          supabase
            .from('property_units')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user?.id)
            .eq('status', 'available'),
        ]);

      setStats({
        clients: clientsResult.count || 0,
        properties: propertiesResult.count || 0,
        simulations: simulationsResult.count || 0,
        availableProperties: availableResult.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Clientes',
      value: stats.clients,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Propiedades',
      value: stats.properties,
      icon: Building2,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Simulaciones',
      value: stats.simulations,
      icon: Calculator,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Propiedades Disponibles',
      value: stats.availableProperties,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bienvenido a HomeCredit - Sistema de Gestión de Créditos MiVivienda
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 text-${card.color.replace('bg-', '')}`} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Award className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Acerca de HomeCredit</h2>
              </div>
              <p className="text-blue-100 text-sm">
                Plataforma integral para gestión y simulación de créditos hipotecarios
              </p>
            </div>

            <div className="p-6 space-y-6 bg-gray-50">
              {/* Descripción principal */}
              <div className="bg-white rounded-lg p-5 border border-gray-200">
                <p className="text-gray-700 leading-relaxed text-base">
                  <span className="font-semibold text-gray-900">HomeCredit</span> es una
                  plataforma integral diseñada para gestionar y simular créditos hipotecarios del
                  <span className="font-semibold text-blue-600"> Fondo MiVivienda</span> en Perú.
                </p>
              </div>

              {/* Características principales */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Características principales
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Users,
                      title: 'Gestión completa',
                      description: 'Clientes y propiedades inmobiliarias',
                      color: 'bg-blue-100 text-blue-600',
                    },
                    {
                      icon: Calculator,
                      title: 'Simulación detallada',
                      description: 'Método francés de amortización',
                      color: 'bg-purple-100 text-purple-600',
                    },
                    {
                      icon: TrendingUp,
                      title: 'Indicadores financieros',
                      description: 'VAN, TIR, TEA y TCEA',
                      color: 'bg-green-100 text-green-600',
                    },
                    {
                      icon: Award,
                      title: 'Bono de Techo Propio',
                      description: 'Soporte completo integrado',
                      color: 'bg-orange-100 text-orange-600',
                    },
                    {
                      icon: FileText,
                      title: 'Periodos de gracia',
                      description: 'Total y parcial disponibles',
                      color: 'bg-indigo-100 text-indigo-600',
                    },
                    {
                      icon: DollarSign,
                      title: 'Múltiples monedas',
                      description: 'Soles y Dólares',
                      color: 'bg-yellow-100 text-yellow-600',
                    },
                    {
                      icon: Shield,
                      title: 'Cumplimiento normativo',
                      description: 'SBS y Fondo MiVivienda',
                      color: 'bg-red-100 text-red-600',
                    },
                    {
                      icon: Scale,
                      title: 'Regulación legal',
                      description: 'Ley N° 26702 y normativas',
                      color: 'bg-teal-100 text-teal-600',
                    },
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${feature.color} p-2 rounded-lg flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer con información legal */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <p>
                    <span className="font-semibold">Sistema conforme</span> a la{' '}
                    <span className="font-semibold text-blue-600">Ley N° 26702</span> y
                    regulaciones del <span className="font-semibold text-blue-600">Fondo MiVivienda</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
