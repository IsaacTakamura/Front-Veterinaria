// core/services/historial-clinico.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Visita } from '../../components/shared/interfaces/historial.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistorialClinicoService {
  private api = '/api/v1/historial';

  constructor(private http: HttpClient) {}

  listarHistorialPorMascota(mascotaId: number): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.api}/mascota/${mascotaId}`);
  }
}
