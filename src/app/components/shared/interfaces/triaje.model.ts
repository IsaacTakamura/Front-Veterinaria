// interfaces/triaje.model.ts
export interface Triaje {
  triajeId?: number;
  fechaRegistro?: string;
  fechaActualizacion?: string;
  frecuenciaCardiaca: number;
  frecuenciaRespiratoria: number;
  observaciones: string;
  peso: number;
  temperatura: number;
  mascotaId?: number; // Opcional para permitir edición sin enviar mascotaId
}
