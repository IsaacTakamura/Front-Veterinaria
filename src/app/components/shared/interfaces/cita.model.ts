export interface Cita {
  citaId: number;
  fechaRegistro: string;
  tipoServicioId: number;
  mascotaId: number;
  clienteId: number;
  veterinarioId: number;
  motivo: string;
  estadoCita: 'PENDIENTE' | 'TRIAJE' | 'CONVETERINARIO' | 'COMPLETADA';
}
