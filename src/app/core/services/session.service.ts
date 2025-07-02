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
/**
 * Servicio responsable de gestionar las sesiones de autenticación de usuarios en toda la aplicación.
 *
 * @description
 * El SessionService proporciona una gestión centralizada del estado de autenticación de usuarios utilizando señales de Angular.
 * Persiste los datos de autenticación (token e información del usuario) en localStorage para mantener las sesiones
 * durante las actualizaciones de página y reinicios del navegador.
 *
 * @usageNotes
 * Este servicio ofrece varias ventajas:
 * - Fuente única de verdad para el estado de autenticación en toda la aplicación
 * - Restauración automática de sesión desde localStorage al iniciar la aplicación
 * - Gestión reactiva del estado de autenticación usando señales de Angular
 * - Clara separación de las preocupaciones de autenticación de la lógica de la aplicación
 * - API simple para operaciones comunes de autenticación (inicio de sesión, cierre de sesión, verificación de estado)
 *
 * Use este servicio para:
 * - Verificar si un usuario está autenticado con `isLoggedIn()`
 * - Acceder a la información del usuario actual con el getter `user`
 * - Obtener el token de autenticación para peticiones API con el getter `token`
 * - Iniciar y cerrar sesión de usuarios con `login()` y `logout()`
 *
 * @example
 * ```typescript
 * // Verificar estado de autenticación
 * if (sessionService.isLoggedIn()) {
 *   console.log(`El usuario ${sessionService.user?.username} ha iniciado sesión`);
 * }
 *
 * // Iniciar sesión de un usuario
 * sessionService.login('jwt-token', { username: 'user1', rol: 'admin' });
 *
 * // Cerrar sesión de un usuario
 * sessionService.logout();
 * ```
 */
