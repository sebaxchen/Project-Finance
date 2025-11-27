import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle2, Send, X } from 'lucide-react';

export function ReclamacionesPage() {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    nombreCompleto: profile?.full_name || '',
    documentoIdentidad: '',
    direccion: '',
    telefono: '',
    email: profile?.email || '',
    menorEdad: false,
    tipoBien: 'producto',
    descripcionBien: '',
    montoReclamado: '',
    tipoSolicitud: 'queja',
    descripcionProblema: '',
    solucionEsperada: '',
    fecha: new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    hora: new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Generar número correlativo
  const numeroCorrelativo = `PE-X-${new Date().getFullYear()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validación básica
    if (
      !formData.nombreCompleto ||
      !formData.documentoIdentidad ||
      !formData.direccion ||
      !formData.telefono ||
      !formData.email ||
      !formData.descripcionProblema
    ) {
      setError('Por favor, completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    try {
      // Simular envío del formulario
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Error al enviar la reclamación. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setFormData({
      nombreCompleto: profile?.full_name || '',
      documentoIdentidad: '',
      direccion: '',
      telefono: '',
      email: profile?.email || '',
      menorEdad: false,
      tipoBien: 'producto',
      descripcionBien: '',
      montoReclamado: '',
      tipoSolicitud: 'queja',
      descripcionProblema: '',
      solucionEsperada: '',
      fecha: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      hora: new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    setError('');
    setSuccess(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hoja de reclamaciones</h1>
        <p className="mt-2 text-gray-600">
          Los datos serán analizados y se te enviará una respuesta en un plazo máximo de 15 días
          hábiles. También puedes consultar{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Ayuda en línea
          </a>{' '}
          para encontrar soluciones y respuestas.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Reclamación enviada exitosamente
              </p>
              <p className="text-sm text-green-600 mt-1">
                Tu reclamación ha sido registrada. Te contactaremos en un plazo máximo de 15 días
                hábiles.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Número correlativo */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número correlativo del reclamo/queja
            </label>
            <p className="text-lg font-semibold text-gray-900">{numeroCorrelativo}</p>
          </div>

          {/* Ingresa tus datos */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ingresa tus datos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="nombreCompleto"
                  name="nombreCompleto"
                  type="text"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="documentoIdentidad" className="block text-sm font-medium text-gray-700 mb-2">
                  Documento de identidad <span className="text-red-500">*</span>
                </label>
                <input
                  id="documentoIdentidad"
                  name="documentoIdentidad"
                  type="text"
                  value={formData.documentoIdentidad}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  id="menorEdad"
                  name="menorEdad"
                  type="checkbox"
                  checked={formData.menorEdad}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="menorEdad" className="ml-2 text-sm text-gray-700">
                  Soy menor de edad
                </label>
              </div>
            </div>
          </div>

          {/* Identificación del Bien Contratado */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Identificación del Bien Contratado
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tipo</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tipoBien"
                      value="producto"
                      checked={formData.tipoBien === 'producto'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Producto</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tipoBien"
                      value="servicio"
                      checked={formData.tipoBien === 'servicio'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Servicio</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="descripcionBien" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  id="descripcionBien"
                  name="descripcionBien"
                  type="text"
                  value={formData.descripcionBien}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="montoReclamado" className="block text-sm font-medium text-gray-700 mb-2">
                  Monto reclamado
                </label>
                <input
                  id="montoReclamado"
                  name="montoReclamado"
                  type="text"
                  value={formData.montoReclamado}
                  onChange={handleChange}
                  placeholder="S/ 0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Ingresa tu solicitud */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ingresa tu solicitud</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de solicitud</label>
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="radio"
                      name="tipoSolicitud"
                      value="queja"
                      checked={formData.tipoSolicitud === 'queja'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
                    />
                    <div className="ml-2">
                      <span className="text-sm font-medium text-gray-700">Queja</span>
                      <p className="text-xs text-gray-500 mt-1">Descripción del problema</p>
                    </div>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="radio"
                      name="tipoSolicitud"
                      value="reclamo"
                      checked={formData.tipoSolicitud === 'reclamo'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
                    />
                    <div className="ml-2">
                      <span className="text-sm font-medium text-gray-700">Reclamo</span>
                      <p className="text-xs text-gray-500 mt-1">Disconformidad con el servicio.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="descripcionProblema" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del problema <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descripcionProblema"
                  name="descripcionProblema"
                  value={formData.descripcionProblema}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe detalladamente el problema..."
                />
              </div>

              <div>
                <label htmlFor="solucionEsperada" className="block text-sm font-medium text-gray-700 mb-2">
                  Solución esperada
                </label>
                <input
                  id="solucionEsperada"
                  name="solucionEsperada"
                  type="text"
                  value={formData.solucionEsperada}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Observaciones del proveedor */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Observaciones y acciones adoptadas por el proveedor
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                Su opinión es importante para nosotros. La firma del colaborador solo acredita la
                recepción de su reclamo o queja. El mismo será procesado en el plazo legal
                correspondiente. La presentación de este reclamo o queja no impide acudir a otros
                medios de solución de controversias o presentar la denuncia ante INDECOPI. El
                proveedor tiene un plazo máximo de 15 días hábiles para responder.
              </p>
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha (dd/mm/yyyy)
                </label>
                <input
                  id="fecha"
                  name="fecha"
                  type="text"
                  value={formData.fecha}
                  onChange={handleChange}
                  placeholder="dd/mm/yyyy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-2">
                  Hora (hh:mm)
                </label>
                <input
                  id="hora"
                  name="hora"
                  type="text"
                  value={formData.hora}
                  onChange={handleChange}
                  placeholder="hh:mm"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Política de privacidad
            </a>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

