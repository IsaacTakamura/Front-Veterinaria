// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'user_name';
const ROL_KEY = 'user_rol';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = '/api/v1/authentication';

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Registra y luego hace login automático
   */
  register(usuario: { username: string; password: string; rol: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/register`, usuario).pipe(
      switchMap(() => this.login(usuario.username, usuario.password)),
      catchError(err => throwError(() => new Error(err.error?.mensaje || 'Error al registrar')))
    );
  }

  /**
   * Login y almacenamiento de datos en localStorage
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USERNAME_KEY, response.nombre || username);
        localStorage.setItem(ROL_KEY, response.rol || '');
        this.handleRedirect(response);
      }),
      catchError(err => throwError(() => new Error(err.error?.mensaje || 'Error al iniciar sesión')))
    );
  }

  /**
   * Obtener info de usuario desde backend
   */
  getUsuarioByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.api}/usuario/${username}`);
  }

  /**
   * Redirige según el rol del usuario
   */
  handleRedirect(response: any) {
    const rol = response.rol?.toUpperCase();
    switch (rol) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'VET':
        this.router.navigate(['/veterinario']);
        break;
      case 'ASISTENTE':
        this.router.navigate(['/enfermera']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  /**
   * Cierra sesión limpiando storage y redirigiendo
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROL_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Devuelve token o null
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Indica si hay sesión activa
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Devuelve el nombre del usuario logueado
   */
  getUserName(): string | null {
    return localStorage.getItem(USERNAME_KEY);
  }

  /**
   * Devuelve el rol del usuario logueado
   */
  getUserRol(): string | null {
    return localStorage.getItem(ROL_KEY);
  }
}
