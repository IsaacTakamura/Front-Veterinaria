// ========== MODELO BASE DE USUARIO (API AUTHENTICATION) ==========
export interface User {
  usuarioId?: number;
  username: string;
  password?: string;
  estado?: 'ACTIVO' | 'INACTIVO';
  fechaRegistro?: string;
  rol: 'ADMIN' | 'VET' | 'ASISTENTE'; // Cambiado VETERINARIO por VET para coincidir con el backend
}

// ========== MODELO DE PERFIL PERSONAL (API ADMIN/PERFIL) ==========
export interface PerfilPersonal {
  perfilId?: number;
  nombres: string;
  apellidos: string;
  telefonoEmergencia?: string;
  direccion?: string;
  alergias?: string;
  usuarioId: number;
  dni?: string; // Campo DNI para veterinarios
}

// ========== MODELO COMBINADO PARA UI ==========
export interface UserWithProfile extends User {
  perfil?: PerfilPersonal;
  // Propiedades adicionales para gestión de DNI de veterinarios
  dniVeterinario?: string;
  estadoDni?: string;
  fechaCreacion?: string;
  fechaUltimoAcceso?: string;
}
