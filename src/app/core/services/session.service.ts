// Importa las dependencias necesarias de Angular
import { Injectable, signal } from '@angular/core';

// Decorador que marca esta clase como un servicio inyectable a nivel de aplicación
@Injectable({ providedIn: 'root' })
export class SessionService {
  // Señal privada que almacena la información del usuario o null si no hay sesión
  private _user = signal<{ username: string; rol: string } | null>(null);

  // Señal privada que almacena el token de autenticación o null si no hay sesión
  private _token = signal<string | null>(null);

  // Constructor que se ejecuta al inicializar el servicio
  constructor() {
    // Obtiene el token almacenado en localStorage, si existe
    const token = localStorage.getItem('auth_token');
    // Obtiene la información de usuario almacenada en localStorage, si existe
    const user = localStorage.getItem('user_info');

    // Si tanto el token como la información de usuario existen en localStorage
    if (token && user) {
      // Establece el valor del token en la señal
      this._token.set(token);
      // Convierte la cadena JSON a objeto y establece el valor en la señal de usuario
      this._user.set(JSON.parse(user));
    }
  }

  // Getter para acceder al valor actual del token
  get token(): string | null {
    return this._token();
  }

  // Getter para acceder a la información actual del usuario
  get user(): { username: string; rol: string } | null {
    return this._user();
  }

  // Método que verifica si el usuario ha iniciado sesión
  // Retorna true si hay un token, false en caso contrario
  isLoggedIn(): boolean {
    return !!this._token();
  }

  // Método para iniciar sesión con un token y datos de usuario
  login(token: string, user: { username: string; rol: string }) {
    // Guarda el token en localStorage
    localStorage.setItem('auth_token', token);
    // Convierte el objeto usuario a JSON y lo guarda en localStorage
    localStorage.setItem('user_info', JSON.stringify(user));
    // Actualiza las señales con los nuevos valores
    this._token.set(token);
    this._user.set(user);
  }

  // Método para cerrar sesión
  logout() {
    // Limpia todo el contenido de localStorage
    localStorage.clear();
    // Restablece las señales a null para indicar que no hay sesión
    this._token.set(null);
    this._user.set(null);
  }
}
