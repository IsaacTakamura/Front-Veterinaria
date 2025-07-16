// veterinario.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Veterinario } from '../../components/shared/interfaces/Veterinario.model'; // Asegúrate de que esta ruta sea correcta

@Injectable({ providedIn: 'root' })
export class VeterinarioService {
  private url = 'http://localhost:8080/api/v1/asistente/listarVeterinarios'; // ajusta a tu ruta real

  constructor(private http: HttpClient) { }

  listarVeterinarios(): Observable<{ data: Veterinario[] }> {
    return this.http.get<{ data: Veterinario[] }>(`${this.url}`);
  }
}
