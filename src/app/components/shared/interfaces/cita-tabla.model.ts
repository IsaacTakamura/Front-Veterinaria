import { Cita } from './cita.model';

export interface CitaTabla extends Cita {
  paciente: string;
  especie: string;
  raza: string;
  propietario: string;
}
