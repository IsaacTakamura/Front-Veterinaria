// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/authentication';

  constructor(private http: HttpClient) { }

  register(usuario: { username: string; password: string; rol: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ token: string; nombre: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
