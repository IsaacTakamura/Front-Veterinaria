import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignoVital } from '../../components/shared/interfaces/SignoVital.model';
import { TipoSignoVital } from '../../components/shared/interfaces/tipoSignoVital';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService {
  private apiUrl = '/api/v1/vet';

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

  // Crear un tipo de signo vital
  crearTipoSignoVital(tipoSignoVital: TipoSignoVital): Observable<{ data: any }> {
    console.log('📤 Enviando petición POST a:', `${this.apiUrl}/crearTipoSignoVital`);
    console.log('📋 Datos enviados:', tipoSignoVital);
    console.log('🔑 Headers:', this.getHeaders());

    return this.http.post<{ data: any }>(`${this.apiUrl}/crearTipoSignoVital`, tipoSignoVital, {
      headers: this.getHeaders()
    });
    /* Se espera, algo como esto:
      {
        "tipoSignoVitalId": 0, // Se genera automaticamente
        "nombre": "string"
      }
    */
  }

  // Listar tipos de signos vitales
  listarTiposSignosVitales(): Observable<TipoSignoVital[]> {
    return this.http.get<TipoSignoVital[]>(`${this.apiUrl}/listarTiposSignosVitales`, {
      headers: this.getHeaders()
    });
    /* Envia algo como esto:
      {
        "codigo": 0,
        "message": "string",
        "data": [
          {
            "tipoSignoVitalId": 0,
            "nombre": "string"
          }
        ]
      }
    */
  }

  // Crear un signo vital
  crearSignoVital(signoVital: SignoVital): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiUrl}/crearSignoVital`, signoVital, {
      headers: this.getHeaders()
    });
    /* Se espera, algo como esto:
      {
        "signoVitalId": 0, // Se genera automaticamente
        "tipoSignoVitalId": 0,
        "valor": 0
      }
    */
  }

  // Listar signos
  listarSignosVitales(mascotaId: number): Observable<SignoVital[]> {
    return this.http.get<SignoVital[]>(`${this.apiUrl}/listarSignosVitales`, {
      headers: this.getHeaders()
    });
    /* Envia algo como esto:
      {
        "codigo": 0,
        "message": "string",
        "data": [
          {
            "signoVitalId": 0,
            "tipoSignoVitalId": 0,
            "valor": 0
          }
        ]
      }
    */
  }
}
