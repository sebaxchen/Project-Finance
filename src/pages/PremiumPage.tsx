import { useState } from 'react';
import { Check, Crown, Building2, Sparkles, X, CreditCard, Home, CheckCircle2 } from 'lucide-react';

export function PremiumPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; color: string } | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
  });
  const [cardType, setCardType] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePlanClick = (plan: { name: string; price: string; color: string }) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setPaymentData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      email: '',
    });
    setCardType(null);
    setPaymentSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Activar animación de éxito
    setPaymentSuccess(true);
    
    // Cerrar el modal después de 2 segundos
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  const detectCardType = (number: string): string | null => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    if (cleaned.startsWith('6')) return 'discover';
    return null;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    const detectedType = detectCardType(formatted);
    setCardType(detectedType);
    setPaymentData({ ...paymentData, cardNumber: formatted });
  };

  const getCardIcon = () => {
    if (!cardType) return <CreditCard className="w-7 h-7 text-gray-300" />;
    
    const icons: Record<string, JSX.Element> = {
      visa: (
        <div className="flex items-center justify-center w-14 h-9 bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg shadow-md border border-blue-400">
          <span className="text-white font-bold text-xs tracking-wider">VISA</span>
        </div>
      ),
      mastercard: (
        <div className="flex items-center justify-center w-14 h-9 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full -ml-2"></div>
          </div>
        </div>
      ),
      amex: (
        <div className="flex items-center justify-center w-14 h-9 bg-gradient-to-r from-blue-700 to-blue-900 rounded-lg shadow-md">
          <span className="text-white font-bold text-xs">AMEX</span>
        </div>
      ),
      discover: (
        <div className="flex items-center justify-center w-14 h-9 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg shadow-md">
          <div className="w-7 h-7 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      ),
    };
    
    return icons[cardType] || <CreditCard className="w-7 h-7 text-gray-300" />;
  };
  const plans = [
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
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; button: string; solid: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        solid: 'bg-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200',
        button: 'bg-green-600 hover:bg-green-700',
        solid: 'bg-green-600',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700',
        solid: 'bg-purple-600',
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200',
        button: 'bg-orange-600 hover:bg-orange-700',
        solid: 'bg-orange-600',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full mb-4">
          <Crown className="w-5 h-5" />
          <span className="font-semibold">Planes Premium</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Elige el plan perfecto para ti
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Desbloquea todas las funcionalidades de HomeCredit y lleva tu negocio al siguiente nivel
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const colors = getColorClasses(plan.color);
          const Icon = plan.isEnterprise ? Building2 : Sparkles;

          return (
            <div
              key={plan.name}
              className={`relative bg-white rounded-xl border-2 ${
                plan.popular ? `${colors.border} shadow-xl` : 'border-gray-200'
              } p-4 flex flex-col transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-3">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${colors.bg} rounded-full mb-2`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
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
                    <Check className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                    <span className="text-gray-700 text-xs">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick({ name: plan.name, price: plan.price, color: plan.color })}
                className={`w-full py-2 px-4 ${colors.button} text-white font-semibold rounded-lg transition-colors text-sm`}
              >
                {plan.isEnterprise ? 'Contactar Ventas' : 'Seleccionar Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal de Datos de Pago */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col relative transition-all duration-500 ${
            paymentSuccess ? 'bg-green-500' : 'bg-white'
          }`}>
            {/* Botón de cerrar */}
            {!paymentSuccess && (
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-2 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Animación de éxito */}
            {paymentSuccess && (
              <div className="absolute inset-0 bg-green-500 flex items-center justify-center z-20 animate-fadeIn">
                <div className="text-center">
                  <div className="mb-6 animate-scaleIn">
                    <CheckCircle2 className="w-24 h-24 text-white mx-auto animate-bounce" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2 animate-slideUp">¡Pago Confirmado!</h2>
                  <p className="text-xl text-white/90 animate-slideUp delay-100">Tu pago se ha procesado exitosamente</p>
                </div>
              </div>
            )}

            {/* Contenido en dos columnas */}
            <div className={`flex-1 overflow-y-auto transition-opacity duration-500 ${
              paymentSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
              <div className="grid md:grid-cols-2 h-full">
                {/* Columna Izquierda - HomeCredit y Plan */}
                <div className={`${selectedPlan ? getColorClasses(selectedPlan.color).solid : 'bg-blue-600'} p-8 flex flex-col justify-center items-center border-r border-gray-200`}>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Home className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-white">HomeCredit</h1>
                        <p className="text-sm text-white/90">MiVivienda</p>
                      </div>
                    </div>

                    {selectedPlan && (
                      <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-center mb-4">
                          <div className={`${getColorClasses(selectedPlan.color).bg} p-3 rounded-full`}>
                            <Crown className={`w-8 h-8 ${getColorClasses(selectedPlan.color).text}`} />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlan.name}</h3>
                        <div className="flex items-baseline justify-center gap-1 mb-4">
                          <span className="text-4xl font-bold text-gray-900">{selectedPlan.price}</span>
                        </div>
                        <p className="text-sm text-gray-500">Plan seleccionado</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Columna Derecha - Formulario de Pago */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Tarjeta
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={paymentData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-4 pr-14 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm hover:shadow-md"
                          required
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          {getCardIcon()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre en la Tarjeta
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                        placeholder="Juan Pérez"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm hover:shadow-md"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fecha de Vencimiento
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            setPaymentData({ ...paymentData, expiryDate: value });
                          }}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm hover:shadow-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                            setPaymentData({ ...paymentData, cvv: value });
                          }}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm hover:shadow-md"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email para la Factura
                      </label>
                      <input
                        type="email"
                        value={paymentData.email}
                        onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm hover:shadow-md"
                        required
                      />
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        Confirmar Pago
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

