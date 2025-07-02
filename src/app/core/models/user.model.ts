export interface User {
  usuarioId?: number;
  username: string;
  password?: string;
  rol: string;
  estado?: string;
  activo?: boolean;
  fechaRegistro?: string;
  fechaCreacion?: string;
}
