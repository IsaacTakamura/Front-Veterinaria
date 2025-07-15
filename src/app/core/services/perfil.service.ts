import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { PerfilPersonal } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private baseUrl = '/api/v1/admin';

  constructor(private http: HttpClient) {}

  // ========== LISTAR TODOS LOS PERFILES ==========
  listarPerfiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/listar`).pipe(
      catchError(error => {
        console.error('Error al listar perfiles:', error);
        return of({ data: [] });
      })
    );
  }

  // ========== OBTENER PERFIL POR USUARIO ID ==========
  obtenerPerfilPorUsuario(usuarioId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuario/${usuarioId}`).pipe(
      catchError(error => {
        console.error('Error al obtener perfil:', error);
        return of({ data: null });
      })
    );
  }

  // ========== CREAR PERFIL PERSONAL ==========
  crearPerfil(perfil: PerfilPersonal): Observable<any> {
    return this.http.post(`${this.baseUrl}/crearPerfil`, perfil).pipe(
      catchError(error => {
        console.error('Error al crear perfil:', error);
        throw error;
      })
    );
  }

  // ========== EDITAR PERFIL PERSONAL ==========
  editarPerfil(perfil: PerfilPersonal): Observable<any> {
    return this.http.put(`${this.baseUrl}/editarPerfil`, perfil).pipe(
      catchError(error => {
        console.error('Error al editar perfil:', error);
        throw error;
      })
    );
  }
}
