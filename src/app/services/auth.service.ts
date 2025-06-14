// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/api/v1/authentication';

  constructor(private http: HttpClient, private router: Router) { }

  register(username: string, password: string, rol: string) {
    return this.http.post<any>(`${this.api}/register`, { username, password, rol }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.handleRedirect(response);
      })
    );
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.api}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.handleRedirect(response);
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']); // Opcional: redirige tras logout
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private handleRedirect(response: any) {
    const rol = response.rol?.toUpperCase(); // Asegura mayúsculas
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
