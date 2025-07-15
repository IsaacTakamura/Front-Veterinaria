import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  // Señales privadas
  private _user = signal<{ username: string; rol: string } | null>(null);
  private _token = signal<string | null>(null);

  constructor() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user_info');

    if (token && user) {
      this._token.set(token);
      this._user.set(JSON.parse(user));
    }
  }

  // ✅ Getter para obtener el token actual
  get token(): string | null {
    return this._token();
  }

  // ✅ Getter para obtener el usuario completo (username y rol)
  get user(): { username: string; rol: string } | null {
    return this._user();
  }

  // ✅ Getter para obtener solo el rol del usuario (usado en guards)
 get role(): string | null {
  return this._user()?.rol ?? null;
}


  // ✅ Getter para obtener solo el username (si se requiere)
  get username(): string | null {
    return this._user()?.username ?? null;
  }

  // ✅ Verifica si hay sesión activa
  isLoggedIn(): boolean {
    return !!this._token();
  }

  // ✅ Inicia sesión y guarda la info
  login(token: string, user: { username: string; rol: string }) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_info', JSON.stringify(user));
  this._token.set(token);
  this._user.set(user);
}


  // ✅ Cierra sesión
  logout() {
    localStorage.clear();
    this._token.set(null);
    this._user.set(null);
  }
}
