// veterinario.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Veterinario } from '../../components/shared/interfaces/Veterinario.model'; // Asegúrate de que esta ruta sea correcta

// Interfaz para la creación de veterinarios
export interface CrearVeterinarioRequest {
  veterinarioId?: number; // Opcional para creación, requerido para edición
  dni: string;
  nombre: string;
  apellido: string;
}

export interface VeterinarioResponse {
  codigo: number;
  message: string;
  data: Veterinario | Veterinario[];
}

@Injectable({ providedIn: 'root' })
export class VeterinarioService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  // Listar todos los veterinarios
  listarVeterinarios(): Observable<VeterinarioResponse> {
    return this.http.get<VeterinarioResponse>(`${this.baseUrl}/admin/listarVeterinarios`);
  }

  // Crear un nuevo veterinario
  crearVeterinario(veterinario: CrearVeterinarioRequest): Observable<VeterinarioResponse> {
    return this.http.post<VeterinarioResponse>(`${this.baseUrl}/admin/crearVeterinario`, veterinario);
  }

  // Obtener un veterinario por apellido
  obtenerVeterinarioPorApellido(apellido: string): Observable<VeterinarioResponse> {
    return this.http.get<VeterinarioResponse>(`${this.baseUrl}/admin/veterinario/${apellido}`);
  }

  // Método heredado del servicio anterior para compatibilidad
  listarVeterinariosAsistente(): Observable<{ data: Veterinario[] }> {
    return this.http.get<{ data: Veterinario[] }>(`${this.baseUrl}/asistente/listarVeterinarios`);
  }
}
