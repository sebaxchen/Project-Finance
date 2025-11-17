// Paleta de 20 colores distintos para clientes
export const CLIENT_COLORS = [
  { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', name: 'Azul' },
  { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', name: 'Verde' },
  { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', name: 'Morado' },
  { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-600', name: 'Rosa' },
  { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-600', name: 'Rojo' },
  { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600', name: 'Naranja' },
  { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-600', name: 'Amarillo' },
  { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-600', name: 'Índigo' },
  { bg: 'bg-teal-500', light: 'bg-teal-100', text: 'text-teal-600', name: 'Verde azulado' },
  { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-600', name: 'Cian' },
  { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600', name: 'Esmeralda' },
  { bg: 'bg-lime-500', light: 'bg-lime-100', text: 'text-lime-600', name: 'Lima' },
  { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600', name: 'Ámbar' },
  { bg: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-600', name: 'Rosa oscuro' },
  { bg: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-600', name: 'Violeta' },
  { bg: 'bg-fuchsia-500', light: 'bg-fuchsia-100', text: 'text-fuchsia-600', name: 'Fucsia' },
  { bg: 'bg-sky-500', light: 'bg-sky-100', text: 'text-sky-600', name: 'Cielo' },
  { bg: 'bg-slate-500', light: 'bg-slate-100', text: 'text-slate-600', name: 'Pizarra' },
  { bg: 'bg-stone-500', light: 'bg-stone-100', text: 'text-stone-600', name: 'Piedra' },
  { bg: 'bg-neutral-500', light: 'bg-neutral-100', text: 'text-neutral-600', name: 'Neutral' },
];

/**
 * Obtiene un color para un cliente basado en su ID o color asignado
 * @param clientId - ID del cliente
 * @param assignedColor - Color asignado (índice 0-19)
 * @returns Objeto con las clases de color
 */
export function getClientColor(clientId: string, assignedColor?: number): typeof CLIENT_COLORS[0] {
  // Si tiene un color asignado, usarlo
  if (assignedColor !== undefined && assignedColor >= 0 && assignedColor < CLIENT_COLORS.length) {
    return CLIENT_COLORS[assignedColor];
  }
  
  // Si no, calcular basado en el ID del cliente usando un hash simple
  let hash = 0;
  for (let i = 0; i < clientId.length; i++) {
    hash = clientId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CLIENT_COLORS.length;
  return CLIENT_COLORS[index];
}

/**
 * Asigna un color nuevo para un cliente (rotando entre los 20 colores)
 * @param existingClientsCount - Número de clientes existentes
 * @returns Índice del color (0-19)
 */
export function assignNewClientColor(existingClientsCount: number): number {
  return existingClientsCount % CLIENT_COLORS.length;
}

