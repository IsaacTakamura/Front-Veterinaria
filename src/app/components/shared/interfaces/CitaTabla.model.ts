import { Cita } from '../../shared/interfaces/cita.model';

export interface CitaTabla extends Cita {
  paciente: string;
  especie: string;
  raza: string;
  propietario: string;
}
