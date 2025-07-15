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

  constructor(private http: HttpClient) {}

  // Registrar un signo vital
  registrarSignoVital(signoVital: SignoVital): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiUrl}/RegistrarSignoVital`, signoVital);
  }

  // Listar signos vitales por mascota
  listarSignosVitalesPorMascota(mascotaId: number): Observable<SignoVital[]> {
    return this.http.get<SignoVital[]>(`${this.apiUrl}/listarSignosVitales/mascota/${mascotaId}`);
  }

  // Listar tipos de signos vitales
  listarTiposSignosVitales(): Observable<TipoSignoVital[]> {
    return this.http.get<TipoSignoVital[]>(`${this.apiUrl}/listarTiposSignosVitales`);
  }
}
