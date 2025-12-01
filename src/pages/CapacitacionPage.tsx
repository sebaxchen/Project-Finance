import { useState } from 'react';
import { Home, Users, Building2, Calculator, HelpCircle, BookOpen, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface CapacitacionPageProps {
  onNavigate?: (page: string) => void;
}

export function CapacitacionPage({ onNavigate }: CapacitacionPageProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const cards = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Aprende a usar el panel principal',
      icon: Home,
      color: 'blue',
    },
    {
      id: 'clients',
      title: 'Clientes',
      description: 'Gestión de clientes y contactos',
      icon: Users,
      color: 'green',
    },
    {
      id: 'properties',
      title: 'Propiedades',
      description: 'Administración de propiedades',
      icon: Building2,
      color: 'purple',
    },
    {
      id: 'simulations',
      title: 'Simulaciones',
      description: 'Cómo crear simulaciones de crédito',
      icon: Calculator,
      color: 'orange',
    },
    {
      id: 'support',
      title: 'Soporte',
      description: 'Obtén ayuda y soporte técnico',
      icon: HelpCircle,
      color: 'indigo',
    },
    {
      id: 'documentacion',
      title: 'Documentación',
      description: 'Guías y documentación completa',
      icon: BookOpen,
      color: 'teal',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string; solid: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        hover: 'hover:bg-blue-100',
        solid: 'bg-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        hover: 'hover:bg-green-100',
        solid: 'bg-green-600',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-100',
        solid: 'bg-purple-600',
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        hover: 'hover:bg-orange-100',
        solid: 'bg-orange-600',
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        hover: 'hover:bg-indigo-100',
        solid: 'bg-indigo-600',
      },
      teal: {
        bg: 'bg-teal-50',
        text: 'text-teal-600',
        hover: 'hover:bg-teal-100',
        solid: 'bg-teal-600',
      },
    };
    return colors[color] || colors.blue;
  };

  const getTutorialContent = (cardId: string) => {
    const tutorials: Record<string, { title: string; steps: string[] }> = {
      dashboard: {
        title: 'Tutorial: Dashboard',
        steps: [
          'El Dashboard es tu panel principal donde puedes ver un resumen de toda tu información.',
          'En la parte superior verás tarjetas con estadísticas: número de clientes, propiedades, simulaciones y propiedades disponibles.',
          'Puedes ver gráficos y análisis de tus datos para tomar mejores decisiones.',
          'Usa el menú lateral para navegar entre las diferentes secciones del sistema.',
          'El Dashboard se actualiza automáticamente con la información más reciente.',
        ],
      },
      clients: {
        title: 'Tutorial: Gestión de Clientes',
        steps: [
          'En la sección de Clientes puedes agregar, editar y eliminar clientes.',
          'Para agregar un nuevo cliente, haz clic en el botón "Agregar Cliente" y completa el formulario.',
          'Puedes buscar clientes usando la barra de búsqueda en la parte superior.',
          'Cada cliente tiene un color único asignado automáticamente para facilitar su identificación.',
          'Puedes editar o eliminar un cliente haciendo clic en los iconos correspondientes en cada tarjeta.',
          'Los clientes están vinculados a las simulaciones de crédito que crees.',
        ],
      },
      properties: {
        title: 'Tutorial: Administración de Propiedades',
        steps: [
          'La sección de Propiedades te permite gestionar todas las propiedades disponibles.',
          'Para agregar una nueva propiedad, haz clic en "Agregar Propiedad" y completa los datos requeridos.',
          'Puedes especificar el distrito, dirección, precio, área y otras características importantes.',
          'Cada propiedad puede tener una imagen asociada para mejor visualización.',
          'Puedes editar o eliminar propiedades desde las opciones en cada tarjeta.',
          'Las propiedades se utilizan para crear simulaciones de crédito para tus clientes.',
        ],
      },
      simulations: {
        title: 'Tutorial: Simulaciones de Crédito',
        steps: [
          'Las Simulaciones te permiten calcular créditos hipotecarios para tus clientes.',
          'Para crear una simulación, haz clic en "Nueva Simulación" y selecciona un cliente y una propiedad.',
          'Ingresa los datos del crédito: monto, tasa de interés, plazo en años, y tipo de moneda.',
          'El sistema calculará automáticamente la cuota mensual y el cronograma de pagos.',
          'Puedes ver los detalles completos de cada simulación haciendo clic en "Ver Detalles".',
          'Las simulaciones se guardan y puedes editarlas o eliminarlas cuando lo necesites.',
        ],
      },
      support: {
        title: 'Tutorial: Soporte Técnico',
        steps: [
          'La sección de Soporte Técnico te permite reportar problemas o solicitar ayuda.',
          'Completa el formulario con el asunto, categoría, prioridad y descripción del problema.',
          'Selecciona la categoría que mejor describa tu problema: error, funcionalidad, rendimiento, etc.',
          'Indica la prioridad según la urgencia: baja, media, alta o urgente.',
          'Proporciona una descripción detallada del problema para que podamos ayudarte mejor.',
          'Nuestro equipo se pondrá en contacto contigo a través del email que proporcionaste.',
        ],
      },
      documentacion: {
        title: 'Tutorial: Documentación',
        steps: [
          'La sección de Documentación contiene todas las guías y manuales del sistema.',
          'Aquí encontrarás información detallada sobre todas las funcionalidades disponibles.',
          'Puedes buscar documentos específicos usando la barra de búsqueda.',
          'Los documentos están organizados por categorías para facilitar su navegación.',
          'Cada documento incluye ejemplos prácticos y capturas de pantalla.',
          'Si no encuentras lo que buscas, puedes contactar a soporte técnico para más ayuda.',
        ],
      },
    };
    return tutorials[cardId] || { title: 'Tutorial', steps: [] };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Capacitación de Usuarios</h1>
        <p className="mt-2 text-gray-600">
          Recursos y materiales de capacitación
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const colors = getColorClasses(card.color);

          return (
            <div
              key={card.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setOpenModal(card.id)}
            >
              <div className={`${colors.bg} p-4 rounded-lg mb-4 inline-flex`}>
                <Icon className={`w-8 h-8 ${colors.text}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Modales de Tutorial */}
      {openModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setOpenModal(null)}
        >
          <div 
            className={`bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col relative ${
              openModal === 'dashboard' ? 'animate-scaleIn' : 'animate-fadeIn'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const selectedCard = cards.find(c => c.id === openModal);
              const tutorial = getTutorialContent(openModal);
              const colors = selectedCard ? getColorClasses(selectedCard.color) : getColorClasses('blue');
              const Icon = selectedCard?.icon || Home;
              const isDashboard = openModal === 'dashboard';

              return (
                <>
                  {/* Header del Modal */}
                  <div className={`${colors.solid} p-6 text-white relative ${isDashboard ? 'animate-slideUp' : ''}`}>
                    <button
                      onClick={() => setOpenModal(null)}
                      className="absolute top-4 right-4 text-white hover:text-gray-200 transition-all duration-300 bg-white/20 rounded-full p-2 hover:bg-white/30 hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className={`bg-white/20 p-3 rounded-lg transition-all duration-300 ${isDashboard ? 'animate-scaleIn hover:scale-110' : ''}`} style={isDashboard ? { animationDelay: '0.2s' } : {}}>
                        <Icon className={`w-8 h-8 ${isDashboard ? 'animate-pulse-slow' : ''}`} />
                      </div>
                      <div className={isDashboard ? 'animate-slideUp' : ''} style={isDashboard ? { animationDelay: '0.3s' } : {}}>
                        <h2 className={`text-2xl font-bold ${isDashboard ? 'transition-all duration-300 hover:scale-105' : ''}`}>{tutorial.title}</h2>
                        <p className="text-white/90 mt-1">{selectedCard?.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contenido del Tutorial */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                      {tutorial.steps.map((step, index) => (
                        <div 
                          key={index} 
                          className={`flex gap-4 ${isDashboard ? 'animate-slideUp' : ''}`}
                          style={isDashboard ? { 
                            animationDelay: `${0.4 + (index * 0.1)}s`,
                            animationFillMode: 'both'
                          } : {}}
                        >
                          <div className={`${colors.bg} p-2 rounded-full flex-shrink-0 h-8 w-8 flex items-center justify-center transition-all duration-300 ${
                            isDashboard ? 'hover:scale-110 hover:shadow-lg' : ''
                          }`}>
                            <span className={`${colors.text} font-bold text-sm`}>{index + 1}</span>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`text-gray-700 leading-relaxed transition-all duration-300 ${
                              isDashboard ? 'hover:text-gray-900' : ''
                            }`}>{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer del Modal */}
                  <div className={`border-t border-gray-200 p-6 flex justify-between items-center ${isDashboard ? 'animate-slideUp' : ''}`} style={isDashboard ? { animationDelay: '0.9s', animationFillMode: 'both' } : {}}>
                    <button
                      onClick={() => setOpenModal(null)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        setOpenModal(null);
                        if (onNavigate && selectedCard) {
                          onNavigate(selectedCard.id);
                        }
                      }}
                      className={`${colors.solid} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg group`}
                    >
                      Ir a {selectedCard?.title}
                      <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1`} />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

