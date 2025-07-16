// core/services/historial-clinico.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Visita } from '../../components/shared/interfaces/historial.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistorialClinicoService {
  private apiAsistente = '/api/v1/asistente';
  private apiVet = '/api/v1/vet';

  constructor(private http: HttpClient) {}

  //* No olvidar que CasosClinicos es igual a HistorialClinico, pero así está en la API

  // Listar todos los casos clínicos por mascota
  listarHistorialPorMascota(mascotaId: number): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiAsistente}/CasosClinicos/mascota/${mascotaId}`);
  }

  // Listar todas las visitas
  listarTodasVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiAsistente}/ListarTodasLasVisitas`);
  }

  // Listar Casos Clínicos por id de caso clínico
  listarCasoClinicoPorId(casoClinicoId: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.apiAsistente}/listarCasoClinicos/${casoClinicoId}`);
  }

  // Listar servicios
  listarServicios(): Observable<{ data: { servicioId: number; nombre: string }[] }> {
    return this.http.get<{ data: { servicioId: number; nombre: string }[] }>(`${this.apiVet}/ListarServicios`);
  }

  // Crear tipo de visita
  crearTipoVisita(tipoVisita: { nombre: string }): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiVet}/CrearTipoVisita`, tipoVisita);
  }

  // Listar tipos de visita
  listarTiposVisita(): Observable<{ data: { tipoVisitaId: number; nombre: string }[] }> {
    return this.http.get<{ data: { tipoVisitaId: number; nombre: string }[] }>(`${this.apiVet}/ListarTiposVisita`);
  }

  // Crear visita
  crearVisita(visita: Visita): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiVet}/crearVisita`, visita);
  }

  // Listar visitas
  listarVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiVet}/listarVisitas`);
  }

  // Actualizar Caso Clínico
  actualizarCasoClinico(casoClinicoId: number, casoClinico: Visita): Observable<{ data: any }> {
    return this.http.put<{ data: any }>(`${this.apiVet}/actualizarCasoClinico/`, casoClinico);
  }

  // Registrar Caso Clínico
  registrarCasoClinico(casoClinico: Visita): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiVet}/RegistrarCasoClinico`, casoClinico);
  }

  // Listar todos los casos clínicos
  listarCasosClinicos(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiVet}/listarCasosClinicos`);
  }

  // Listar casos clínicos por mascotaId
  listarCasosClinicosPorMascotaId(mascotaId: number): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiVet}/CasoClinico/mascota/${mascotaId}`);
  }
}
