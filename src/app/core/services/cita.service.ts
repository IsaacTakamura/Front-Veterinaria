import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../../components/shared/interfaces/cita.model'; // ✅ Esto está bien
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service'; // ✅ Importa correctamente

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiAsistente = '/api/v1/asistente';
  private apiVet = '/api/v1/vet';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  agendar(cita: Cita): Observable<{ data: any }> {
    // Probar con diferentes endpoints
    return this.http.post<{ data: any }>(`${this.apiAsistente}/RegistrarCita`, cita);
    /* Ejemplo de lo que espera:
        {
  "citaId": 0,
  "fechaRegistro": "2025-07-14T23:04:57.880Z",
  "tipoServicioId": 0,
  "mascotaId": 0,
  "clienteId": 0,
  "veterinarioId": 0,
  "motivo": "string",
  "estadoCita": "PENDIENTE"
}
    */
  }

  listarTiposServicio(): Observable<{ data: { tipoServicioId: number; nombre: string }[] }> {
    return this.http.get<{ data: { tipoServicioId: number; nombre: string }[] }>(`${this.apiAsistente}/listarTiposServicios`);
  }

  listarCitas(): Observable<Cita[]> {
    // El endpoint correcto es /api/v1/asistente/listar
    return this.http.get<Cita[]>(`${this.apiAsistente}/listar`);
  }

  // Ahora listarCitasHoy obtiene la fecha de hoy y llama al endpoint de fecha
  obtenerCitasDeHoy(): Observable<Cita[]> {
    return this.http.get<{ codigo: number; message: string; data: Cita[] }>(`${this.apiAsistente}/citas/hoy`)
      .pipe(map(res => res.data));
  }

  listarCitasPorFecha(fecha: string): Observable<Cita[]> {
    // El endpoint correcto es /api/v1/asistente/fecha?fecha=yyyy-MM-dd
    return this.http.get<Cita[]>(`${this.apiAsistente}/fecha`, { params: { fecha } });
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
    return this.http.get<Cita>(`${this.apiAsistente}/Cita/cliente/${id}`);
  }

  //! Método para cambiar el estado de una cita, pero con la id de la cita
  //! El estado puede ser PENDIENTE, TRIAJE, CONVETERINARIO, COMPLETADA
  cambiarEstadoCita(id: number, estado: string): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiAsistente}/estado/${id}/${estado}`, {}, {
      params: { nuevoEstado: estado }
    });
  }
  /* espera algo como esto:
  {
  "codigo": 0,
  "message": "string",
  "data": {
    "citaId": 0, // no necesario enviar
    "fechaRegistro": "2025-07-17T04:40:56.717Z", // se llena automáticamente
    "tipoServicioId": 0,
    "mascotaId": 0,
    "clienteId": 0,
    "veterinarioId": 0,
    "motivo": "string",
    "estadoCita": "PENDIENTE"
  }
}
  */
   //? Listar citas para veterinario
  listarCitasVeterinario(clienteId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiVet}/listarCitas`, {
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
      "citaId": 0,
      "fechaRegistro": "2025-07-17T05:54:31.255Z",
      "tipoServicioId": 0,
      "mascotaId": 0,
      "clienteId": 0,
      "veterinarioId": 0,
      "motivo": "string",
      "estadoCita": "PENDIENTE"
    }
  ]
}
  */
  //? Listar citas hoy para veterinario
  listarCitasHoyVeterinario(): Observable<Cita[]> {
    return this.http.get<{ codigo: number; message: string; data: Cita[] }>(`${this.apiVet}/Listarcitas/hoy`, {
      headers: this.getHeaders()
    }).pipe(map(res => res.data));
  }

  /*
  Se espera algo como esto:
  {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "citaId": 0,
      "fechaRegistro": "2025-07-17T05:56:17.427Z",
      "tipoServicioId": 0,
      "mascotaId": 0,
      "clienteId": 0,
      "veterinarioId": 0,
      "motivo": "string",
      "estadoCita": "PENDIENTE"
    }
  ]
}
  */

  //? Listar cita por id para veterinario
  listarCitaporId(citaId: number): Observable<{ data: Cita }> {
    return this.http.get<{ data: Cita }>(`${this.apiVet}/listarCita/${citaId}`, {
      headers: this.getHeaders()
    });
  }
  /*
    Se espera algo como esto:
    {
  "codigo": 0,
  "message": "string",
  "data": {
    "citaId": 0,
    "fechaRegistro": "2025-07-17T05:58:07.552Z",
    "tipoServicioId": 0,
    "mascotaId": 0,
    "clienteId": 0,
    "veterinarioId": 0,
    "motivo": "string",
    "estadoCita": "PENDIENTE"
  }
}
  */
}
