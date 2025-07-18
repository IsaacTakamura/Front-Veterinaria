// core/services/triaje.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Triaje } from '../../components/shared/interfaces/triaje.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class TriajeService {
  private api = '/api/v1/asistente';
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

  // actualizarTriaje usando el id del triaje
  actualizarTriaje(id: number, triaje: Triaje): Observable<Triaje> {
    // PUT /api/v1/asistente/triaje/{id}
    return this.http.put<Triaje>(`${this.api}/triaje/${id}`, triaje);
  }
  /*
  Ejemplo de envio:
  {
  "triajeId": 0,
  "temperatura": 0,
  "peso": 0,
  "frecuenciaCardiaca": 0,
  "frecuenciaRespiratoria": 0,
  "observaciones": "string",
  "mascotaId": 0, // no se envia mascotaid, o se malogra
  "fechaRegistro": "2025-07-17T01:13:13.240Z", se llena automaticamente
  "fechaActualizacion": "2025-07-17T01:13:13.240Z", se llena automaticamente
}

  */

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

  //? Endpoint para veterinario

  // Listar triaje para mascota por id de mascota para veterinario
  listarTriajePorMascotaIdVeterinario(mascotaId: number): Observable<Triaje[]> {
    // GET /api/v1/vet/triaje/mascota/{mascotaId}
    return this.http.get<Triaje[]>(`${this.apiVet}/triaje/mascota/${mascotaId}`, {
      headers: this.getHeaders()
    });
  }
  /*
  Se espera algo como:
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
      "fechaRegistro": "2025-07-18T03:39:25.809Z",
      "fechaActualizacion": "2025-07-18T03:39:25.809Z"
    }
  ]
}
  */

  // Actualizar triaje por id de mascota para veterinario
  actualizarTriajeVeterinario(id: number, triaje: Triaje): Observable<Triaje> {
    // PUT /api/v1/vet/triaje/{id}
    return this.http.put<Triaje>(`${this.apiVet}/triaje/${id}`, triaje, {
      headers: this.getHeaders()
    });
  }
  /*
{
  "codigo": 0,
  "message": "string",
  "data": {
    "triajeId": 0,
    "temperatura": 0,
    "peso": 0,
    "frecuenciaCardiaca": 0,
    "frecuenciaRespiratoria": 0,
    "observaciones": "string",
    "mascotaId": 0,
    "fechaRegistro": "2025-07-18T03:39:25.803Z",
    "fechaActualizacion": "2025-07-18T03:39:25.803Z"
  }
}
  */
}
