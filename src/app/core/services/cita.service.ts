import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../../components/shared/interfaces/cita.model'; // ✅ Esto está bien

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private baseUrl = '/api/v1/asistente';

  constructor(private http: HttpClient) { }

  agendar(cita: Cita): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.baseUrl}/RegistrarCita`, cita);
  }

  listarTiposServicio(): Observable<{ data: { tipoServicioId: number; nombre: string }[] }> {
    return this.http.get<{ data: { tipoServicioId: number; nombre: string }[] }>(`${this.baseUrl}/listarTiposServicio`);
  }
}
