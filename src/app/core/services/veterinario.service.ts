// veterinario.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VeterinarioService {
  private url = 'http://localhost:8080/api/v1/asistente/listarVeterinarios'; // ajusta a tu ruta real

  constructor(private http: HttpClient) {}

  listarVeterinarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}`);
  }
}
