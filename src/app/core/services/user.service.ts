import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // ajusta ruta según ubicación


export interface Usuario {
  id?: number;
  username: string;
  password: string;
  rol: string;
  estado?: string;          // ACTIVO | INACTIVO
  fechaCreacion?: string;   // ISO format
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/v1/authentication';

  constructor(private http: HttpClient) {}

  /**
   * Registra un nuevo usuario con estado y fecha de creación.
   */
  registrarUsuario(data: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  /**
   * Obtiene la lista de usuarios registrados en el sistema.
   */
 obtenerUsuarios(): Observable<{ data: any[] }> {
  return this.http.get<{ data: any[] }>('/api/v1/authentication/listar');
}

obtenerUsuarioPorUsername(username: string): Observable<any> {
  return this.http.get(`/api/v1/authentication/usuario/${username}`);
}


  /**
   * Desactiva (cambia estado a INACTIVO) un usuario existente por su ID.
   */
 desactivarUsuario(usuarioId: number): Observable<any> {
  return this.http.put(`/api/v1/authentication/desactivar/${usuarioId}`, {});
}

actualizarUsuario(data: {
  usuarioId: number;
  username: string;
  rol: string;
  estado: string;
  password?: string;
  fechaRegistro: string;
}): Observable<any> {
  return this.http.put('/api/v1/authentication/actualizar', data, {
    headers: { 'Content-Type': 'application/json' }
  });
}






  /**
   * (Opcional) Método futuro para reactivar un usuario.
   */
  activarUsuario(usuarioId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/activar/${usuarioId}`, {});
  }
}
