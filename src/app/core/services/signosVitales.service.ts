import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignoVital } from '../../components/shared/interfaces/SignoVital.model';
import { TipoSignoVital } from '../../components/shared/interfaces/tipoSignoVital';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService {
  private apiUrl = '/api/v1/vet';

  constructor(private http: HttpClient) { }

  // Crear un tipo de signo vital
  crearTipoSignoVital(tipoSignoVital: TipoSignoVital): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiUrl}/CrearTipoSignoVital`, tipoSignoVital);
    /* Se espera, algo como esto:
      {
        "tipoSignoVitalId": 0, // Se genera automaticamente
        "nombre": "string"
      }
    */
  }

  // Listar tipos de signos vitales
  listarTiposSignosVitales(): Observable<TipoSignoVital[]> {
    return this.http.get<TipoSignoVital[]>(`${this.apiUrl}/listarTiposSignosVitales`);
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
    return this.http.post<{ data: any }>(`${this.apiUrl}/crearSignoVital`, signoVital);
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
    return this.http.get<SignoVital[]>(`${this.apiUrl}/listarSignosVitales`);
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
