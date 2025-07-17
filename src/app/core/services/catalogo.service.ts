import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Especie } from '../../components/shared/interfaces/especie.model';
import { Raza } from '../../components/shared/interfaces/Raza.model';
import { Observable, catchError, map, of } from 'rxjs';

interface ApiResponse<T> {
  codigo: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private apiUrl = '/api/v1/admin';

  constructor(private http: HttpClient) {}

  listarEspecies(): Observable<Especie[]> {
    return this.http.get<ApiResponse<Especie[]> | Especie[]>(`${this.apiUrl}/listarEspecies`)
      .pipe(
        map(response => {
          // Verificar si la respuesta sigue el formato ApiResponse
          if (response && 'data' in response && Array.isArray(response.data)) {
            return response.data;
          }
          // Si es directamente un array
          if (Array.isArray(response)) {
            return response;
          }
          // Si no es ninguno de los casos anteriores, devolver array vacío
          console.warn('⚠️ Formato de respuesta de especies inesperado:', response);
          return [];
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Error al listar especies:', error);
          return of([]);
        })
      );
  }

  listarRazas(): Observable<Raza[]> {
    return this.http.get<ApiResponse<Raza[]> | Raza[]>(`${this.apiUrl}/listarRazas`)
      .pipe(
        map(response => {
          // Verificar si la respuesta sigue el formato ApiResponse
          if (response && 'data' in response && Array.isArray(response.data)) {
            return response.data;
          }
          // Si es directamente un array
          if (Array.isArray(response)) {
            return response;
          }
          // Si no es ninguno de los casos anteriores, devolver array vacío
          console.warn('⚠️ Formato de respuesta de razas inesperado:', response);
          return [];
        }),
        catchError((error: HttpErrorResponse) => {
          // Cuando es un 500 con mensaje específico, interpretamos como "no hay datos"
          if (error.status === 500 && 
              error.error && 
              error.error.message && 
              error.error.message.includes('No se encontraron razas')) {
            console.log('📝 No hay razas en la base de datos (manejado graciosamente)');
            return of([]);
          }
          console.error('❌ Error al listar razas:', error);
          return of([]);
        })
      );
  }

  crearEspecie(especie: Partial<Especie>): Observable<any> {
    const payload = {
      nombre: especie.nombre
    };
    return this.http.post(`${this.apiUrl}/crearEspecie`, payload);
  }

  crearRaza(raza: Partial<Raza>): Observable<any> {
    const payload = {
      nombre: raza.nombre,
      especieId: raza.especieId
    };
    return this.http.post(`${this.apiUrl}/crearRaza`, payload);
  }
}
