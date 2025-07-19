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
  private ApiAdmin = 'http://localhost:8080/api/v1/admin';
  private ApiRecep = 'http://localhost:8080/api/v1/asistente';

  constructor(private http: HttpClient) { }

  // Listar todos los veterinarios para administrador
  listarVeterinarios(): Observable<VeterinarioResponse> {
    return this.http.get<VeterinarioResponse>(`${this.ApiAdmin}/listarVeterinarios`);
  }

  // Crear un nuevo veterinario para administrador
  crearVeterinario(veterinario: CrearVeterinarioRequest): Observable<VeterinarioResponse> {
    return this.http.post<VeterinarioResponse>(`${this.ApiAdmin}/crearVeterinario`, veterinario);
  }

  // Obtener un veterinario por apellido para administrador
  obtenerVeterinarioPorApellido(apellido: string): Observable<VeterinarioResponse> {
    return this.http.get<VeterinarioResponse>(`${this.ApiAdmin}/veterinario/${apellido}`);
  }

  // listar veterinarios para asistente
  listarVeterinariosAsistente(): Observable<{ data: Veterinario[] }> {
    return this.http.get<{ data: Veterinario[] }>(`${this.ApiRecep}/listarVeterinarios`);
  }
}
