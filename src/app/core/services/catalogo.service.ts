import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Especie } from '../../components/shared/interfaces/especie.model';
import { Raza } from '../../components/shared/interfaces/Raza.model';
import { Observable, catchError, map, of, from, mergeMap, toArray, switchMap } from 'rxjs';

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

  // Eliminar especie (primero elimina las razas asociadas, luego la especie)
  eliminarEspecie(especieId: number): Observable<any> {
    const url = `${this.apiUrl}/eliminarEspecie/${especieId}`;
    console.log('🔄 Eliminando especie - URL completa:', url);
    console.log('🔄 Eliminando especie - ID:', especieId);
    console.log('🔄 apiUrl base:', this.apiUrl);
    
    return this.http.delete<any>(url)
      .pipe(
        map(response => {
          console.log('✅ Respuesta eliminar especie RAW:', response);
          console.log('✅ Tipo de respuesta:', typeof response);
          console.log('✅ Código de respuesta:', response?.codigo);
          
          // Verificar estructura de respuesta según documentación: {codigo, message, data}
          if (response && (response.codigo === 0 || response.codigo === 200)) {
            console.log('✅ Especie eliminada correctamente (código válido)');
            return response;
          }
          
          // Si no hay respuesta o es undefined, asumimos que fue exitoso (algunos backends no devuelven contenido)
          if (!response || response === null || response === undefined) {
            console.log('✅ Especie eliminada (sin contenido de respuesta)');
            return { codigo: 0, message: 'Especie eliminada correctamente', data: null };
          }
          
          // Si el mensaje indica éxito, no lanzar error
          if (response.message && (
            response.message.toLowerCase().includes('eliminad') ||
            response.message.toLowerCase().includes('eliminado') ||
            response.message.toLowerCase().includes('success') ||
            response.message.toLowerCase().includes('correcto')
          )) {
            console.log('✅ Especie eliminada (detectado por mensaje)');
            return { codigo: 0, message: response.message, data: response.data };
          }
          
          console.log('❌ Respuesta no reconocida como exitosa:', response);
          throw new Error(response?.message || 'Error al eliminar la especie');
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Error al eliminar especie - Status:', error.status);
          console.error('❌ Error al eliminar especie - URL:', error.url);
          console.error('❌ Error al eliminar especie - Message:', error.error?.message);
          console.error('❌ Error al eliminar especie - Body completo:', error.error);
          console.error('❌ Error al eliminar especie - Detalles completos:', error);
          
          // Si es error 404 pero la petición se completó, puede ser un falso negativo
          if (error.status === 404 && error.error?.message?.toLowerCase().includes('no encontrad')) {
            console.log('⚠️ Error 404 pero puede ser falso negativo - la especie ya fue eliminada');
            // En lugar de lanzar error, devolvemos success ya que la especie "no se encuentra" (fue eliminada)
            return of({ codigo: 0, message: 'Especie eliminada correctamente', data: null });
          }
          
          // Si es error 500, es probable que sea por integridad referencial
          if (error.status === 500) {
            console.error('💡 Error 500 - Posible problema de integridad referencial con razas asociadas');
          }
          
          throw error;
        })
      );
  }

  // Eliminar especie con manejo manual de razas asociadas
  eliminarEspecieConRazas(especieId: number, razasAsociadas: any[]): Observable<any> {
    console.log('🔄 Eliminando especie con manejo manual de razas');
    console.log('📋 Razas a eliminar:', razasAsociadas);
    
    // Si no hay razas asociadas, eliminar directamente la especie
    if (!razasAsociadas || razasAsociadas.length === 0) {
      console.log('📝 No hay razas asociadas, eliminando especie directamente');
      return this.eliminarEspecie(especieId);
    }
    
    // Verificar que las razas tengan ID válido
    const razasValidas = razasAsociadas.filter(raza => 
      raza && (raza.razaId || raza.id)
    );
    
    if (razasValidas.length === 0) {
      console.log('⚠️ No se encontraron razas con ID válido, eliminando especie directamente');
      return this.eliminarEspecie(especieId);
    }
    
    console.log('🔄 Eliminando razas primero:', razasValidas);
    
    // Primero eliminar todas las razas asociadas
    const eliminarRazasObservables = razasValidas.map(raza => {
      const razaId = raza.razaId || raza.id;
      console.log(`🗑️ Eliminando raza ID: ${razaId}`);
      return this.eliminarRaza(razaId);
    });
    
    // Usar from para convertir el array de observables
    return from(eliminarRazasObservables).pipe(
      mergeMap(eliminarObservable => eliminarObservable),
      toArray(),
      switchMap((resultados) => {
        console.log('✅ Todas las razas eliminadas:', resultados);
        console.log('🔄 Procediendo a eliminar la especie');
        return this.eliminarEspecie(especieId);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en eliminación con razas:', error);
        
        // Si fallan las razas, intentar eliminar solo la especie
        if (error.status === 404) {
          console.log('🔄 Endpoint de eliminar raza no existe, eliminando solo especie');
          return this.eliminarEspecie(especieId);
        }
        
        throw error;
      })
    );
  }

  // Eliminar raza específica
  eliminarRaza(razaId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminarRaza/${razaId}`)
      .pipe(
        map(response => {
          console.log('🔍 Respuesta de eliminar raza:', response);
          
          // Verificar estructura de respuesta según documentación: {codigo, message, data}
          if (response && (response.codigo === 0 || response.codigo === 200)) {
            console.log('✅ Raza eliminada correctamente (código válido)');
            return response;
          }
          
          // Si no hay respuesta o es undefined, asumimos que fue exitoso
          if (!response || response === null || response === undefined) {
            console.log('✅ Raza eliminada (sin contenido de respuesta)');
            return { codigo: 0, message: 'Raza eliminada correctamente', data: null };
          }
          
          // Si el mensaje indica éxito, no lanzar error
          if (response.message && (
            response.message.toLowerCase().includes('eliminad') ||
            response.message.toLowerCase().includes('eliminado') ||
            response.message.toLowerCase().includes('success') ||
            response.message.toLowerCase().includes('correcto')
          )) {
            console.log('✅ Raza eliminada (detectado por mensaje)');
            return { codigo: 0, message: response.message, data: response.data };
          }
          
          throw new Error(response?.message || 'Error al eliminar la raza');
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Error al eliminar raza:', error);
          
          // Si es error 404 pero puede ser falso negativo
          if (error.status === 404 && error.error?.message?.toLowerCase().includes('no encontrad')) {
            console.log('⚠️ Error 404 en raza pero puede ser falso negativo');
            return of({ codigo: 0, message: 'Raza eliminada correctamente', data: null });
          }
          
          throw error;
        })
      );
  }
}
