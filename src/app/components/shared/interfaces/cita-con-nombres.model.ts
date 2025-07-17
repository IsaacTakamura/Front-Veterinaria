import { Cita } from './cita.model';

export interface CitaConNombres extends Cita {
  nombreMascota?: string;
  nombreCliente?: string;
}
