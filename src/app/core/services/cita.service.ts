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
    return this.http.get<{ data: { tipoServicioId: number; nombre: string }[] }>(`${this.baseUrl}/listarTiposServicios`);
  }

  listarCitas(): Observable<Cita[]> {
    // El endpoint correcto es /api/v1/asistente/listar
    return this.http.get<Cita[]>(`${this.baseUrl}/listar`);
  }

  // Ahora listarCitasHoy obtiene la fecha de hoy y llama al endpoint de fecha
  listarCitasHoy(): Observable<Cita[]> {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fecha = `${yyyy}-${mm}-${dd}`;
    return this.listarCitasPorFecha(fecha);
  }

  listarCitasPorFecha(fecha: string): Observable<Cita[]> {
    // El endpoint correcto es /api/v1/asistente/fecha?fecha=yyyy-MM-dd
    return this.http.get<Cita[]>(`${this.baseUrl}/fecha`, { params: { fecha } });
  }

  // Listar citas programadas usando el endpoint /api/v1/asistente/fecha
  listarCitasProgramadas(): Observable<Cita[]> {
    // Se asume que el backend espera la fecha en formato YYYY-MM-DD
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fecha = `${yyyy}-${mm}-${dd}`;
    return this.listarCitasPorFecha(fecha);
  }

  //* esperar el endpoint para obtener los detalles de la cita por id
  obtenerDetalleCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.baseUrl}/Cita/cliente/${id}`);
  }
}
