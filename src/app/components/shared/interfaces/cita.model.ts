export interface Cita {
  citaId?: number; // Opcional para permitir creación sin ID
  fechaRegistro: string;
  tipoServicioId: number;
  mascotaId: number;
  clienteId: number;
  veterinarioId: number;
  motivo: string;
  estadoCita: 'PENDIENTE' | 'TRIAJE' | 'CONVETERINARIO' | 'COMPLETADA';
}
