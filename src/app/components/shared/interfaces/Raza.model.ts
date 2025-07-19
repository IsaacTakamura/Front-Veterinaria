export interface Raza {
  razaId?: number; // 🔧 CAMBIO: Hacer opcional como TipoServicio
  nombre: string;
  especieId: number; // Este sí se necesita para la relación
}
