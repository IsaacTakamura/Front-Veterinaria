import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private http = inject(HttpClient);
  private baseUrl = '/api/v1/asistente';

  buscarMascotaPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/mascota/nombre/${nombre}`);
  }

  obtenerClientePorId(clienteId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cliente/${clienteId}`);
  }
}
