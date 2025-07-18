import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoServicio } from '../../components/shared/interfaces/tipo-servicio.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TipoServicioService {
  private apiUrl = '/api/v1/admin';

  constructor(private http: HttpClient) {}

  listarTiposServicios(): Observable<TipoServicio[]> {
    return this.http.get<TipoServicio[]>(`${this.apiUrl}/listarTiposServicios`);
  }

  crearTipoServicio(tipo: TipoServicio): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearTipoServicio`, tipo);
  }

  eliminarTipoServicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarTipoServicio/${id}`);
  }
}
