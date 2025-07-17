import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/components/shared/interfaces/paciente.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private baseUrl = '/api/v1/asistente';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/mascota/listarMascota`, {
      headers: this.getHeaders()
    });
  }

  obtenerPacientePorNombre(nombre: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}/mascota/nombre/${nombre}`, {
      headers: this.getHeaders()
    });
  }

  listarCasosClinicos(mascotaId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/CasosClinicos/mascota/${mascotaId}`, {
      headers: this.getHeaders()
    });
  }

  listarServicios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ListarServicios`, {
      headers: this.getHeaders()
    });
  }

  listarVisitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listarTodasLasVisitas`, {
      headers: this.getHeaders()
    });
  }
}
