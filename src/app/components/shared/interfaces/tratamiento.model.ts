export interface Tratamiento {
  id: number;
  paciente: string;       // nombre del paciente
  propietario: string;    // nombre del dueño
  tratamiento: string;
  fechaInicio: string;
  fechaFin: string;
  status: string;         // "Activo", "Completado", etc.
  diasRestantes: number;
  proximaDosis: string | null;
}
