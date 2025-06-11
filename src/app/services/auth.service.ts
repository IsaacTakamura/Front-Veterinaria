// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/authentication';

  constructor(private http: HttpClient) { }

  register(usuario: { username: string; password: string; rol: string }) {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }
}
