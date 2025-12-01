import { Home, ArrowRight, Users, Calculator, CheckCircle2, Crown, Building2, Sparkles, Check, FileText, BarChart3, Zap } from 'lucide-react';
import libroImage from '../assets/libro.jpeg';
import sebastianImage from '../assets/team/Sebastian.jpeg';
import luisImage from '../assets/team/luis.jpeg';
import christianImage from '../assets/team/christian.jpeg';
import henryImage from '../assets/team/henry.jpeg';

interface LandingPageProps {
  onNavigateToAuth: () => void;
}

export function LandingPage({ onNavigateToAuth }: LandingPageProps) {

  const teamMembers = [
    {
      name: 'Beingolea Montalvo Sebastián',
      role: 'Software',
      description: 'U202217853',
      image: sebastianImage,
    },
    {
      name: 'Benites Sandoval Luis Derek',
      role: 'Sistemas',
      description: 'U201812390',
      image: luisImage,
    },
    {
      name: 'Bonifacio Espiritu Andrés',
      role: 'Sistemas',
      description: 'U202120718',
      image: null,
    },
    {
      name: 'Christian Quispe Rea',
      role: 'Sistemas',
      description: 'U202218523',
      image: christianImage,
    },
    {
      name: 'Diaz Gutierrez Henry Kevin',
      role: 'Software',
      description: 'U201819674',
      image: henryImage,
    },
    {
      name: 'Huamaní Gálvez Carlos',
      role: 'Sistemas',
      description: 'U202217217',
      image: null,
    },
  ];

  const simulationSteps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: '1. Ingresa los datos del cliente',
      description: 'Registra la información personal y financiera del cliente, incluyendo ingresos y capacidad de pago.',
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: '2. Selecciona la propiedad',
      description: 'Elige o registra la propiedad que el cliente desea adquirir, con todos sus detalles y valoración.',
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: '3. Configura la simulación',
      description: 'Define los parámetros del crédito: monto, plazo, tasa de interés y tipo de bono MiVivienda.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: '4. Obtén resultados detallados',
      description: 'Recibe un análisis completo con cronograma de pagos, indicadores financieros (VAN, TIR, TEA, TCEA) y proyecciones.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Columna Izquierda - Empresa y Descripción */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 p-3 rounded-lg shadow-lg">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800">HomeCredit</h1>
              </div>
              
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Gestión Inteligente de Créditos Hipotecarios
              </h2>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                HomeCredit es una plataforma integral diseñada para asesores financieros y empresas del sector inmobiliario. 
                Nos especializamos en la simulación y gestión de créditos hipotecarios del Fondo MiVivienda con Bono de Techo Propio.
              </p>
              
              <p className="text-lg text-gray-700 mb-8">
                Nuestra solución permite realizar simulaciones precisas, calcular indicadores financieros clave (VAN, TIR, TEA, TCEA) 
                y gestionar de manera eficiente clientes y propiedades, todo mientras garantizamos el cumplimiento normativo de la SBS 
                y el Fondo MiVivienda.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Simulaciones precisas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Cumplimiento normativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Gestión integral</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Soporte especializado</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Botón */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white rounded-2xl p-12 w-full max-w-md text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
                    <Home className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Accede a HomeCredit
                  </h3>
                  <p className="text-gray-600">
                    Comienza a gestionar créditos hipotecarios de manera profesional
                  </p>
                </div>
                
                <button
                  onClick={onNavigateToAuth}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Ingresar a HomeCredit</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce al equipo de expertos que hace posible HomeCredit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-center mb-4">
                  {member.image ? (
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 overflow-hidden border-2 border-blue-500 shadow-lg">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full text-4xl mb-4">
                      👨‍💻
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo se hace la simulación Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cómo se hace la simulación</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un proceso simple y eficiente en 4 pasos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {simulationSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
                <div className="text-blue-600 mb-4 mt-4">{step.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-xl p-6 shadow-lg">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div className="text-left">
                <h4 className="font-bold text-gray-900 mb-1">Proceso automatizado</h4>
                <p className="text-gray-600 text-sm">Todo el cálculo se realiza de forma automática y precisa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planes Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Planes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Básico',
                price: 'Gratis',
                period: '',
                description: 'Perfecto para empezar',
                features: [
                  'Hasta 10 clientes',
                  'Hasta 20 propiedades',
                  'Simulaciones ilimitadas',
                  'Soporte por email',
                  'Reportes básicos',
                ],
                popular: false,
                color: 'blue',
              },
              {
                name: 'Profesional',
                price: 'S/ 79',
                period: 'mes',
                description: 'Para profesionales independientes',
                features: [
                  'Clientes ilimitados',
                  'Propiedades ilimitadas',
                  'Simulaciones avanzadas',
                  'Soporte prioritario',
                  'Reportes detallados',
                  'Exportación de datos',
                  'API access',
                ],
                popular: true,
                color: 'green',
              },
              {
                name: 'Premium',
                price: 'S/ 149',
                period: 'mes',
                description: 'Máxima funcionalidad',
                features: [
                  'Todo lo del plan Profesional',
                  'Análisis predictivo',
                  'Dashboard personalizado',
                  'Soporte 24/7',
                  'Integraciones avanzadas',
                  'Backup automático',
                  'Multi-usuario',
                  'Capacitación incluida',
                ],
                popular: false,
                color: 'purple',
              },
              {
                name: 'Empresarial',
                price: 'Personalizado',
                period: '',
                description: 'Solución completa para empresas',
                features: [
                  'Todo lo del plan Premium',
                  'Usuarios ilimitados',
                  'Soporte dedicado',
                  'Personalización completa',
                  'Integración con sistemas propios',
                  'Capacitación en sitio',
                  'SLA garantizado',
                  'Gerente de cuenta asignado',
                ],
                popular: false,
                color: 'orange',
                isEnterprise: true,
              },
            ].map((plan) => {
              const colors = {
                blue: {
                  bg: 'bg-blue-50',
                  text: 'text-blue-600',
                  border: 'border-blue-200',
                  button: 'bg-blue-600 hover:bg-blue-700',
                },
                green: {
                  bg: 'bg-green-50',
                  text: 'text-green-600',
                  border: 'border-green-200',
                  button: 'bg-green-600 hover:bg-green-700',
                },
                purple: {
                  bg: 'bg-purple-50',
                  text: 'text-purple-600',
                  border: 'border-purple-200',
                  button: 'bg-purple-600 hover:bg-purple-700',
                },
                orange: {
                  bg: 'bg-orange-50',
                  text: 'text-orange-600',
                  border: 'border-orange-200',
                  button: 'bg-orange-600 hover:bg-orange-700',
                },
              };

              const colorClasses = colors[plan.color as keyof typeof colors] || colors.blue;
              const Icon = plan.isEnterprise ? Building2 : Sparkles;

              return (
                <div
                  key={plan.name}
                  className={`relative bg-white rounded-xl border-2 ${
                    plan.popular ? `${colorClasses.border} shadow-xl` : 'border-gray-200'
                  } p-6 flex flex-col transition-all hover:shadow-lg`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-600 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                        Más Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${colorClasses.bg} rounded-full mb-2`}>
                      <Icon className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period && <span className="text-gray-500 text-sm">/{plan.period}</span>}
                    </div>
                  </div>

                  <ul className="flex-1 space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 ${colorClasses.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={onNavigateToAuth}
                    className={`w-full py-2 px-4 ${colorClasses.button} text-white font-semibold rounded-lg transition-colors text-sm`}
                  >
                    {plan.isEnterprise ? 'Contactar Ventas' : plan.name === 'Básico' ? 'Comenzar Gratis' : 'Seleccionar Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Columna 1: Logo y Descripción */}
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">HomeCredit</h3>
                  <p className="text-xs text-gray-400">MiVivienda</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Sistema integral para simular y gestionar créditos hipotecarios del Fondo MiVivienda con Bono de Techo Propio.
              </p>
            </div>

            {/* Columna 2: Producto */}
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clientes
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Propiedades
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Simulaciones
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Planes Premium
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Soporte */}
            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Soporte Técnico
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Documentación
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 4: Políticas */}
            <div>
              <h4 className="text-white font-semibold mb-4">Políticas</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:opacity-80 transition-opacity inline-block"
                  >
                    <img
                      src={libroImage}
                      alt="Libro de Reclamaciones"
                      className="h-16 w-16 object-contain"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Política de Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} HomeCredit. Todos los derechos reservados.
              </p>
              <p className="text-xs text-gray-500">
                Sistema de gestión de créditos hipotecarios
              </p>
            </div>
          </div>

          {/* Letras grandes HomeCredit */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h2 className="text-8xl md:text-9xl font-bold text-white text-center tracking-tight">
              HomeCredit
            </h2>
          </div>
        </div>
      </footer>
    </div>
  );
}

