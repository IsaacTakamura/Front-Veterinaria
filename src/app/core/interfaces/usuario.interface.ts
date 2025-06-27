export interface Usuario {
  usuarioId: number;
  username: string;
  password?: string; // opcional si ya viene ofuscado o no se necesita
  rol: 'ADMIN' | 'VET' | 'ASISTENTE';
}

