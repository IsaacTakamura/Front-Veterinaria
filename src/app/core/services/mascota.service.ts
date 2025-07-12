// src/app/core/services/mascota.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../../components/shared/interfaces/mascota.model';
import { Raza } from '../../components/shared/interfaces/Raza.model';
import { Paciente } from 'src/app/components/shared/interfaces/paciente.model';
import { AuthService } from 'src/app/core/services/auth.service'; // ✅ Importa correctamente

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private baseUrl = '/api/v1/asistente';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/mascotas`, {
      headers: this.getHeaders()
    });
  }

  buscarPorNombre(nombre: string): Observable<{ data: Mascota }> {
    return this.http.get<{ data: Mascota }>(`${this.baseUrl}/mascota/nombre/${nombre}`);
  }

  crear(mascota: Mascota): Observable<{ data: Mascota }> {
    return this.http.post<{ data: Mascota }>(`${this.baseUrl}/crearMascota`, mascota, {
      headers: this.getHeaders()
    });
  }

  listarRazas(): Observable<{ data: Raza[] }> {
    return this.http.get<{ data: Raza[] }>(`${this.baseUrl}/mascota/listarRazas`, {
      headers: this.getHeaders()
    });
  }

  listarMascotaPorId(id: number): Observable<{ data: Mascota }> {
    return this.http.get<{ data: Mascota }>(`${this.baseUrl}/mascota/${id}`);
  }
}
