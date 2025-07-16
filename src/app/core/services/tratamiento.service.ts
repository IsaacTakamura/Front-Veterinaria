import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tratamiento } from 'src/app/components/shared/interfaces/tratamiento.model';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {
  private baseUrl = '/api/v1/asistente';

  constructor(private http: HttpClient) {}

  obtenerTratamientos(): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`${this.baseUrl}/tratamientos`);
  }
}
