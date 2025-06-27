import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserDTO {
  username: string;
  password: string;
  rol: 'VET' | 'ASISTENTE' | 'ADMIN';
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v1/authentication';

  registrarUsuario(usuario: UserDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, usuario);
  }

  buscarUsuarioPorUsername(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuario/${username}`);
  }


  // Obtener usuarios (GET) – futura implementación en backend
/*
obtenerUsuarios(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
}
*/



 // Cambiar estado de usuario (PATCH) – futura implementación
/*
cambiarEstado(username: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/usuarios/${username}/estado`, {});
}
*/



}
