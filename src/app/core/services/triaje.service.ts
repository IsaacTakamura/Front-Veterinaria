// core/services/triaje.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Triaje } from '../../components/shared/interfaces/triaje.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TriajeService {
  private api = '/api/v1/asistente';

  constructor(private http: HttpClient) { }

  crearTriaje(triaje: Triaje): Observable<Triaje> {
    // POST /api/v1/asistente/crearTriaje
    return this.http.post<Triaje>(`${this.api}/crearTriaje`, triaje);
    /* Ejemplo de objeto Triaje:
    {
  "triajeId": 0,
  "temperatura": 0,
  "peso": 0,
  "frecuenciaCardiaca": 0,
  "frecuenciaRespiratoria": 0,
  "observaciones": "string",
  "mascotaId": 0,
  "fechaRegistro": "2025-07-11T19:52:52.305Z",
  "fechaActualizacion": "2025-07-11T19:52:52.305Z"
    }

    */
  }

  actualizarTriaje(id: number, triaje: Triaje): Observable<Triaje> {
    // PUT /api/v1/asistente/triaje/{id}
    return this.http.put<Triaje>(`${this.api}/triaje/${id}`, triaje);
  }

  obtenerTriajePorMascotaId(mascotaId: number): Observable<Triaje[]> {
    // GET /api/v1/asistente/triaje/mascota/{mascotaId}
    return this.http.get<Triaje[]>(`${this.api}/triaje/mascota/${mascotaId}`);
    /*
    Ejemplo de respuesta:
      {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "triajeId": 0,
      "temperatura": 0,
      "peso": 0,
      "frecuenciaCardiaca": 0,
      "frecuenciaRespiratoria": 0,
      "observaciones": "string",
      "mascotaId": 0,
      "fechaRegistro": "2025-07-11T20:02:20.150Z",
      "fechaActualizacion": "2025-07-11T20:02:20.150Z"
    }
  ]
}
    */
  }

}
