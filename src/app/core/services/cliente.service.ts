import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../components/shared/interfaces/cliente.model'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = '/api/v1/asistente';

  constructor(private http: HttpClient) {}

  buscarPorNombre(nombre: string): Observable<{ data: Cliente[] }> {
    return this.http.get<{ data: Cliente[] }>(`${this.baseUrl}/cliente/nombre/${nombre}`);
  }

  crear(cliente: Cliente): Observable<{ data: Cliente }> {
    return this.http.post<{ data: Cliente }>(`${this.baseUrl}/crearCliente`, cliente);
  }
}
