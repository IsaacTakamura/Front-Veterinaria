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
  mascotaId: number;
}
