import { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Users, 
  Building2, 
  Calculator,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  Edit,
  Trash2
} from 'lucide-react';

export function DocumentacionPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    inicio: true,
    dashboard: false,
    clientes: false,
    propiedades: false,
    simulaciones: false,
    preguntas: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'inicio',
      title: 'Introducción a HomeCredit',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">¿Qué es HomeCredit?</h3>
                <p className="text-blue-800 text-sm">
                  HomeCredit es una plataforma diseñada para ayudarte a gestionar créditos hipotecarios 
                  de manera eficiente. Con esta herramienta puedes administrar clientes, propiedades y 
                  realizar simulaciones de crédito de forma rápida y precisa.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Características principales</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Gestión de Clientes:</strong> Mantén un registro completo de todos tus clientes con información de contacto y detalles importantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Catálogo de Propiedades:</strong> Administra todas las propiedades disponibles con imágenes, precios y características detalladas.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Simulaciones de Crédito:</strong> Calcula créditos hipotecarios con diferentes tasas, plazos y montos para encontrar la mejor opción.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Dashboard Intuitivo:</strong> Visualiza estadísticas y resúmenes de tu negocio en un solo lugar.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Primeros pasos</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Comienza agregando tus primeros clientes en la sección "Clientes"</li>
              <li>Registra las propiedades disponibles en "Propiedades"</li>
              <li>Crea simulaciones de crédito vinculando clientes con propiedades</li>
              <li>Revisa el Dashboard para ver un resumen de toda tu información</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Dashboard - Panel Principal',
      icon: Home,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            El Dashboard es tu punto de entrada principal. Aquí encontrarás un resumen visual de toda tu información.
          </p>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tarjetas de Estadísticas</h3>
            <p className="text-gray-700 mb-3">
              En la parte superior del Dashboard verás cuatro tarjetas con información clave:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600">•</span>
                <span><strong>Total de Clientes:</strong> Muestra cuántos clientes has registrado en el sistema.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-green-600">•</span>
                <span><strong>Total de Propiedades:</strong> Indica el número de propiedades que tienes disponibles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-purple-600">•</span>
                <span><strong>Total de Simulaciones:</strong> Cuenta todas las simulaciones de crédito que has creado.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-orange-600">•</span>
                <span><strong>Propiedades Disponibles:</strong> Muestra las propiedades que aún no están asignadas a una simulación.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Gráficos y Análisis</h3>
            <p className="text-gray-700">
              El Dashboard también incluye gráficos que te ayudan a visualizar tendencias y tomar decisiones 
              informadas sobre tu negocio. Estos gráficos se actualizan automáticamente cuando agregas o modificas información.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-800 text-sm">
                <strong>Tip:</strong> El Dashboard se actualiza en tiempo real. Cada vez que agregues un cliente, 
                propiedad o simulación, verás los cambios reflejados inmediatamente.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'clientes',
      title: 'Gestión de Clientes',
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            La sección de Clientes te permite mantener un registro completo y organizado de todas las personas 
            con las que trabajas.
          </p>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Agregar un Nuevo Cliente</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Haz clic en el botón <strong>"Agregar Cliente"</strong> en la parte superior de la página</li>
              <li>Completa el formulario con la información del cliente:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Nombre completo (obligatorio)</li>
                  <li>Número de documento (DNI o similar)</li>
                  <li>Email de contacto</li>
                  <li>Teléfono</li>
                  <li>Dirección</li>
                </ul>
              </li>
              <li>Haz clic en <strong>"Guardar Cliente"</strong> para registrar la información</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Buscar Clientes</h3>
            <p className="text-gray-700">
              Usa la barra de búsqueda en la parte superior para encontrar clientes rápidamente. Puedes buscar 
              por nombre, documento o email. La búsqueda se realiza en tiempo real mientras escribes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Editar o Eliminar Clientes</h3>
            <p className="text-gray-700 mb-2">
              Cada tarjeta de cliente tiene dos botones en la esquina superior derecha:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li className="flex items-start gap-2">
                <Edit className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>Editar:</strong> Permite modificar la información del cliente. Haz clic en el icono de lápiz.</span>
              </li>
              <li className="flex items-start gap-2">
                <Trash2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span><strong>Eliminar:</strong> Elimina permanentemente el cliente del sistema. Esta acción no se puede deshacer.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Colores de Identificación</h3>
            <p className="text-gray-700">
              Cada cliente recibe automáticamente un color único que aparece en su tarjeta. Esto te ayuda 
              a identificar y organizar visualmente a tus clientes.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm">
                <strong>Mejor práctica:</strong> Mantén la información de tus clientes actualizada. Esto te 
                ayudará a crear simulaciones más precisas y mantener una comunicación efectiva.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'propiedades',
      title: 'Administración de Propiedades',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            En esta sección puedes gestionar todas las propiedades que tienes disponibles para ofrecer a tus clientes.
          </p>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Agregar una Nueva Propiedad</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Haz clic en <strong>"Agregar Propiedad"</strong></li>
              <li>Completa el formulario con los siguientes datos:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li><strong>Nombre de la propiedad:</strong> Un nombre descriptivo (ej: "Departamento en Miraflores")</li>
                  <li><strong>Distrito:</strong> Selecciona el distrito de la lista desplegable</li>
                  <li><strong>Dirección:</strong> Dirección completa de la propiedad</li>
                  <li><strong>Precio:</strong> Precio de venta en soles o dólares</li>
                  <li><strong>Área:</strong> Área total en metros cuadrados</li>
                  <li><strong>Imagen:</strong> Puedes subir una imagen de la propiedad (opcional pero recomendado)</li>
                </ul>
              </li>
              <li>Haz clic en <strong>"Guardar Propiedad"</strong></li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Visualización de Propiedades</h3>
            <p className="text-gray-700">
              Las propiedades se muestran en tarjetas con la imagen (si está disponible), el nombre, distrito, 
              precio y área. Esto te permite ver rápidamente todas las opciones disponibles.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Editar o Eliminar Propiedades</h3>
            <p className="text-gray-700">
              Al igual que con los clientes, puedes editar o eliminar propiedades usando los botones en la 
              esquina superior derecha de cada tarjeta. Al editar, puedes modificar cualquier campo, incluyendo 
              la imagen.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Uso en Simulaciones</h3>
            <p className="text-gray-700">
              Una vez que hayas registrado propiedades, podrás seleccionarlas al crear simulaciones de crédito. 
              Esto vincula automáticamente la propiedad con el cliente y el crédito.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800 text-sm">
                <strong>Consejo:</strong> Agrega imágenes atractivas de las propiedades. Esto no solo mejora 
                la presentación, sino que también ayuda a tus clientes a visualizar mejor las opciones disponibles.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'simulaciones',
      title: 'Simulaciones de Crédito',
      icon: Calculator,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Las simulaciones de crédito son el corazón de HomeCredit. Te permiten calcular diferentes escenarios 
            de crédito hipotecario para ayudar a tus clientes a tomar decisiones informadas.
          </p>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Crear una Nueva Simulación</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Haz clic en <strong>"Nueva Simulación"</strong></li>
              <li>Selecciona un <strong>Cliente</strong> de la lista desplegable (debes tener al menos un cliente registrado)</li>
              <li>Selecciona una <strong>Propiedad</strong> de la lista (debes tener al menos una propiedad registrada)</li>
              <li>Completa los datos del crédito:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li><strong>Monto del crédito:</strong> Cantidad que el cliente solicitará prestada</li>
                  <li><strong>Tasa de interés anual:</strong> Porcentaje de interés (ej: 8.5 para 8.5%)</li>
                  <li><strong>Plazo en años:</strong> Número de años para pagar el crédito</li>
                  <li><strong>Moneda:</strong> Selecciona entre Soles (PEN) o Dólares (USD)</li>
                </ul>
              </li>
              <li>Haz clic en <strong>"Calcular Simulación"</strong></li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Resultados de la Simulación</h3>
            <p className="text-gray-700 mb-2">
              Una vez creada la simulación, el sistema calcula automáticamente:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Cuota mensual:</strong> El monto que el cliente deberá pagar cada mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Total a pagar:</strong> Suma total incluyendo intereses</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Cronograma de pagos:</strong> Desglose mes a mes del plan de pagos</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Ver Detalles de una Simulación</h3>
            <p className="text-gray-700">
              Haz clic en <strong>"Ver Detalles"</strong> en cualquier tarjeta de simulación para ver el 
              cronograma completo de pagos, incluyendo el desglose de capital e intereses para cada cuota.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Editar o Eliminar Simulaciones</h3>
            <p className="text-gray-700">
              Puedes editar una simulación para cambiar los parámetros del crédito (tasa, plazo, monto) 
              y recalcular. También puedes eliminar simulaciones que ya no necesites.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Comparar Simulaciones</h3>
            <p className="text-gray-700">
              Crea múltiples simulaciones con diferentes parámetros para el mismo cliente y propiedad. 
              Esto te permite comparar opciones y mostrarle al cliente diferentes escenarios de pago.
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <p className="text-purple-800 text-sm">
                <strong>Tip profesional:</strong> Crea simulaciones con diferentes plazos (15, 20, 25 años) 
                para que tus clientes puedan ver cómo cambia la cuota mensual y el total a pagar. Esto les 
                ayuda a elegir la opción que mejor se adapte a su presupuesto.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'preguntas',
      title: 'Preguntas Frecuentes',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">¿Puedo eliminar un cliente que ya tiene simulaciones?</h3>
            <p className="text-gray-700">
              Sí, puedes eliminar un cliente en cualquier momento. Sin embargo, ten en cuenta que las simulaciones 
              asociadas a ese cliente seguirán existiendo, pero mostrarán que el cliente ya no está disponible.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">¿Cómo cambio la moneda de una simulación?</h3>
            <p className="text-gray-700">
              Puedes editar una simulación existente y cambiar el campo de moneda. El sistema recalculará 
              automáticamente todos los valores en la nueva moneda.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">¿Puedo exportar mis datos?</h3>
            <p className="text-gray-700">
              Actualmente, los datos se almacenan en la nube y puedes acceder a ellos desde cualquier dispositivo 
              con tu cuenta. Si necesitas exportar datos, contacta con soporte técnico.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">¿Los datos están seguros?</h3>
            <p className="text-gray-700">
              Sí, todos tus datos están protegidos con encriptación y solo tú puedes acceder a ellos con tu 
              cuenta. No compartimos información con terceros.
            </p>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-indigo-800 text-sm font-semibold mb-1">
                  ¿Tienes más preguntas?
                </p>
                <p className="text-indigo-700 text-sm">
                  Si no encuentras la respuesta que buscas, puedes contactarnos a través de la sección 
                  <strong> Soporte Técnico</strong> en el menú lateral. Estaremos encantados de ayudarte.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documentación</h1>
        <p className="mt-2 text-gray-600">
          Guía completa de uso de HomeCredit para usuarios
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSections[section.id];

          return (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 animate-slideUp">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

