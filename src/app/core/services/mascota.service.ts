import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../../components/shared/interfaces/mascota.model';
import { Raza } from '../../components/shared/interfaces/Raza.model';
import { Paciente } from 'src/app/components/shared/interfaces/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private baseUrl = '/api/v1/asistente';

  constructor(private http: HttpClient) { }

  // 🔍 Buscar mascota por nombre
  buscarPorNombre(nombre: string): Observable<{ data: Mascota }> {
    return this.http.get<{ data: Mascota }>(`${this.baseUrl}/nombre/${nombre}`);
  }

  // ➕ Crear una nueva mascota
  crear(mascota: Mascota): Observable<{ data: Mascota }> {
    return this.http.post<{ data: Mascota }>(`${this.baseUrl}/crearMascota`, mascota);
  }

  // 📋 Listar razas disponibles
  listarRazas(): Observable<{ data: Raza[] }> {
    return this.http.get<{ data: Raza[] }>(`${this.baseUrl}/mascota/listarRazas`);
  }

  // ✅ Obtener lista de pacientes (mascotas con raza, especie y propietario)
  listarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}/listarMascota`);
  }
}
