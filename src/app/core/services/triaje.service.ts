// core/services/triaje.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Triaje } from '../../components/shared/interfaces/triaje.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TriajeService {
  private api = '/api/v1/triaje';

  constructor(private http: HttpClient) {}

  registrarTriaje(triaje: Triaje): Observable<Triaje> {
    return this.http.post<Triaje>(`${this.api}`, triaje);
  }
}
