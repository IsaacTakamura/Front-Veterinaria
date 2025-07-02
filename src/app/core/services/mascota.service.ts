import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../../components/shared/interfaces/mascota.model'; // ✅ Esto está bien
import { Raza } from '../../components/shared/interfaces/Raza.model'; // ✅ Esto está bien

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private baseUrl = '/api/v1/asistente';

  constructor(private http: HttpClient) {}

  buscarPorNombre(nombre: string): Observable<{ data: Mascota }> {
    return this.http.get<{ data: Mascota }>(`${this.baseUrl}/mascota/nombre/${nombre}`);
  }

  crear(mascota: Mascota): Observable<{ data: Mascota }> {
    return this.http.post<{ data: Mascota }>(`${this.baseUrl}/crearMascota`, mascota);
  }

  listarRazas(): Observable<{ data: Raza[] }> {
    return this.http.get<{ data: Raza[] }>(`${this.baseUrl}/mascota/listarRazas`);
  }
}
