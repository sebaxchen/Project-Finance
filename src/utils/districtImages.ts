// Importar las imágenes
import mirafloresImg from '../assets/distritos/miraflores.jpeg';
import sanIsidroImg from '../assets/distritos/san isidro.jpeg';
import jesusMariaImg from '../assets/distritos/jesus maria.jpeg';
import barrancoImg from '../assets/distritos/barranco.jpeg';
import surcoImg from '../assets/distritos/surco.jpeg';

// Mapeo de distritos a sus imágenes
const DISTRICT_IMAGES: Record<string, string> = {
  'miraflores': mirafloresImg,
  'san isidro': sanIsidroImg,
  'jesus maria': jesusMariaImg,
  'jesús maría': jesusMariaImg,
  'barranco': barrancoImg,
  'surco': surcoImg,
  'santiago de surco': surcoImg,
};

/**
 * Obtiene la imagen del distrito si cumple con las condiciones
 * @param district - Nombre del distrito
 * @param province - Nombre de la provincia
 * @param department - Nombre del departamento
 * @returns URL de la imagen o null si no aplica
 */
export function getDistrictImage(
  district?: string,
  province?: string,
  department?: string
): string | null {
  // Verificar que sea Lima, Lima, Lima
  const isLima = 
    province?.toLowerCase().trim() === 'lima' &&
    department?.toLowerCase().trim() === 'lima';

  if (!isLima || !district) {
    return null;
  }

  // Normalizar el nombre del distrito
  const normalizedDistrict = district.toLowerCase().trim();
  
  // Buscar la imagen correspondiente
  const image = DISTRICT_IMAGES[normalizedDistrict];
  
  if (image) {
    return image;
  }
  
  return null;
}

