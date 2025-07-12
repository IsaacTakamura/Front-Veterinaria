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
}

// ========== MODELO COMBINADO PARA UI ==========
export interface UserWithProfile extends User {
  perfil?: PerfilPersonal;
}
