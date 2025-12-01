import libroImage from '../../assets/libro.jpeg';
import { HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLibroReclamaciones = () => {
    onNavigate('reclamaciones');
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">HomeCredit</p>
              <p className="text-xs text-gray-500">MiVivienda</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleLibroReclamaciones}
              className="hover:opacity-80 transition-opacity"
              title="Libro de Reclamaciones"
            >
              <img
                src={libroImage}
                alt="Libro de Reclamaciones"
                className="h-12 w-auto object-contain"
              />
            </button>
            <button
              onClick={() => onNavigate('support')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Soporte Técnico"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Soporte</span>
            </button>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">
                © {currentYear} HomeCredit. Todos los derechos reservados.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Sistema de gestión de créditos hipotecarios
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

