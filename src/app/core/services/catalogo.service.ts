import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Especie } from '../../components/shared/interfaces/especie.model';
import { Raza } from '../../components/shared/interfaces/Raza.model';
import { Observable, of, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private apiUrl = '/api/v1/admin';

  constructor(private http: HttpClient) {}

  listarEspecies(): Observable<Especie[]> {
    const token = localStorage.getItem('auth_token');
    console.log('🌐 Haciendo petición GET /listarEspecies');
    console.log('🔑 Token presente:', token ? 'SÍ' : 'NO');
    
    return this.http.get<any>(`${this.apiUrl}/listarEspecies`).pipe(
      map(resp => {
        console.log('✅ Respuesta especies recibida:', resp);
        return resp?.data || [];
      }),
      catchError(error => {
        console.log('⚠️ Error en listarEspecies:', error);
        
        // Si es error 500 (probablemente base de datos vacía), retornar array vacío
        if (error.status === 500) {
          console.log('📋 Error 500 - Probablemente base de datos vacía. Retornando array vacío.');
          return of([]);
        }
        
        // Para otros errores, retornar array vacío también para evitar crashes
        console.log('📋 Error inesperado, retornando array vacío para mantener estabilidad.');
        return of([]);
      })
    );
  }

  listarRazas(): Observable<Raza[]> {
    const token = localStorage.getItem('auth_token');
    console.log('🌐 Haciendo petición GET /listarRazas');
    console.log('🔑 Token presente:', token ? 'SÍ' : 'NO');
    
    return this.http.get<any>(`${this.apiUrl}/listarRazas`).pipe(
      map(resp => {
        console.log('✅ Respuesta razas recibida:', resp);
        return resp?.data || [];
      }),
      catchError(error => {
        console.log('⚠️ Error en listarRazas:', error);
        
        // Si es error 500 (probablemente base de datos vacía), retornar array vacío
        if (error.status === 500) {
          console.log('📋 Error 500 - Probablemente base de datos vacía. Retornando array vacío.');
          return of([]);
        }
        
        // Para otros errores, retornar array vacío también para evitar crashes
        console.log('📋 Error inesperado, retornando array vacío para mantener estabilidad.');
        return of([]);
      })
    );
  }

  crearEspecie(especie: Partial<Especie>): Observable<any> {
    // Verificar token antes de enviar
    const token = localStorage.getItem('auth_token');
    console.log('🔐 CatalogoService.crearEspecie - Token presente:', token ? 'SÍ' : 'NO');
    
    if (!token) {
      console.error('❌ No hay token disponible para crear especie');
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }
    
    // Enviar con especieId: 0 como documenta la API
    const payload = {
      especieId: 0,
      nombre: especie.nombre
    };
    console.log('📤 Enviando especie:', payload);
    console.log('🌐 URL completa:', `${this.apiUrl}/crearEspecie`);
    
    return this.http.post(`${this.apiUrl}/crearEspecie`, payload).pipe(
      catchError(error => {
        console.error('❌ Error en crearEspecie:', error);
        
        if (error.status === 401 || error.status === 403) {
          console.error('🔐 Error de autenticación/autorización');
        }
        
        throw error; // Re-lanzar el error para que el componente lo maneje
      })
    );
  }

  crearRaza(raza: Partial<Raza>): Observable<any> {
    // Verificar token antes de enviar
    const token = localStorage.getItem('auth_token');
    console.log('🔐 CatalogoService.crearRaza - Token presente:', token ? 'SÍ' : 'NO');
    
    if (!token) {
      console.error('❌ No hay token disponible para crear raza');
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }
    
    // Enviar con razaId: 0 como documenta la API
    const payload = {
      razaId: 0,
      nombre: raza.nombre,
      especieId: raza.especieId
    };
    console.log('📤 Enviando raza:', payload);
    console.log('🌐 URL completa:', `${this.apiUrl}/crearRaza`);
    
    return this.http.post(`${this.apiUrl}/crearRaza`, payload).pipe(
      catchError(error => {
        console.error('❌ Error en crearRaza:', error);
        
        if (error.status === 401 || error.status === 403) {
          console.error('🔐 Error de autenticación/autorización');
        }
        
        throw error; // Re-lanzar el error para que el componente lo maneje
      })
    );
  }
}
