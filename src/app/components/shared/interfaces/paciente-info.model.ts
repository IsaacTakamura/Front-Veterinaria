export interface PacienteInfo {
  nombreMascota: string;
  edad: number;
  raza: string;
  especie: string;
  propietario: string;
  mascotaId?: number; // ID de la mascota
  clienteId?: number; // ID del cliente (opcional para compatibilidad)
  telefono?: string; // Teléfono del propietario (opcional)
  fechaRegistro?: string; // Fecha de registro (opcional)
}
