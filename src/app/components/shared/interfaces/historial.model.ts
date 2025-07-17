// interfaces/historial.model.ts

// Interfaz para Caso Clínico
export interface CasoClinico {
  casoClinicoId: number;
  descripcion: string;
  mascotaId: number;
}

// Interfaz para Tipo de Visita
export interface TipoVisita {
  tipoVisitaId: number;
  nombre: string;
}

// Interfaz para Visita
export interface Visita {
  visitaId: number;
  casoClinicoId: number;
  tipoVisitaId?: number;
  tipoVisita?: TipoVisita;
  casoClinico?: CasoClinico;
  fecha?: string;
}

// Interfaz para el historial completo de una mascota
export interface HistorialMascota {
  casoClinico: CasoClinico;
  visitas: Visita[];
}
