import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cita {
  fecha: string;
  hora: string;
  motivo: string;
  mascotaId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private baseUrl = '/api/v1/asistente';

  constructor(private http: HttpClient) {}

  agendar(cita: Cita): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.baseUrl}/RegistrarCita`, cita);
  }
}
