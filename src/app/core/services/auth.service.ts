// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = '/api/v1/authentication';

  constructor(private http: HttpClient, private router: Router) { }

  register(usuario: { username: string; password: string; rol: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/register`, usuario).pipe(
      switchMap(() => {
        // Login automático tras registro
        return this.login(usuario.username, usuario.password);
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_name', response.nombre || username);
        localStorage.setItem('user_rol', response.rol || ''); // Guarda el rol
        this.handleRedirect(response);
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_rol');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  handleRedirect(response: any) {
    const rol = response.rol?.toUpperCase();
    if (rol === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (rol === 'VET') {
      this.router.navigate(['/veterinario']);
    } else if (rol === 'ASISTENTE') {
      this.router.navigate(['/enfermera']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
