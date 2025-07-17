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
  private apiAsistente = '/api/v1/asistente';
  private apiVet = '/api/v1/vet';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  listarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiAsistente}/mascotas`, {
      headers: this.getHeaders()
    });
  }

  buscarPorNombre(nombre: string): Observable<{ data: Mascota }> {
    return this.http.get<{ data: Mascota }>(`${this.apiAsistente}/mascota/nombre/${nombre}`);
  }

  crear(mascota: Mascota): Observable<{ data: Mascota }> {
    return this.http.post<{ data: Mascota }>(`${this.apiAsistente}/crearMascota`, mascota, {
      headers: this.getHeaders()
    });
  }

  listarRazas(): Observable<{ data: Raza[] }> {
    return this.http.get<{ data: Raza[] }>(`${this.apiAsistente}/mascota/listarRazas`, {
      headers: this.getHeaders()
    });
  }

  listarMascotaPorId(id: number): Observable<{ data: Mascota }> {
    return this.http.get<{ data: Mascota }>(`${this.apiAsistente}/mascota/${id}`);
  }

  // Visualizacion de mascota para veterinario

  // Listar Resumen
  listarResumenMascota(mascotaId: number): Observable<{ data: Mascota }> {
    return this.http.get<{ data: Mascota }>(`${this.apiVet}/resumen`, {
      headers: this.getHeaders()
    });
  }
  /* Se recibe, algo asi:
      {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "nombreMascota": "string",
      "razaMascota": "string",
      "nombreDueno": "string"
    }
  ]
}
  */

  // Listar pacientes por veterinario
  listarPacientesPorVeterinario(veterinarioId: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiVet}/pacientes/${veterinarioId}`, {
      headers: this.getHeaders()
    });
  }
  /*
  Se espera algo como esto:
  {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "nombreMascota": "string",
      "especie": "string",
      "raza": "string",
      "edad": 0,
      "nombrePropietario": "string",
      "telefonoPropietario": "string",
      "ultimaVisita": "2025-07-15",
      "proximaCita": "2025-07-15"
    }
  ]
}
  */

  // Listar generalmente todas las mascotas
  listarMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiVet}/listar`, {
      headers: this.getHeaders()
    });
  }

  /*
  Se espera algo como esto:
    {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "mascotaId": 0,
      "nombre": "string",
      "edad": 0,
      "estado": "VIVO",
      "razaId": 0,
      "clienteId": 0
    }
  ]
}
  */

  // Listar mascotas por id para veterinario
  listarMascotaPorIdVeterinario(id: number): Observable<{ data: Mascota }> {
    return this.http.get<{ data: Mascota }>(`${this.apiVet}/buscar/mascotabyId/${id}`, {
      headers: this.getHeaders()
    });
  }
  /*
  Se espera algo como esto:
  {
  "codigo": 0,
  "message": "string",
  "data": {
    "mascotaId": 0,
    "nombre": "string",
    "edad": 0,
    "estado": "VIVO",
    "razaId": 0,
    "clienteId": 0
  }
}
  */
}
