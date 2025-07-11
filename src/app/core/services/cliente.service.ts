import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../components/shared/interfaces/cliente.model'; // Ajusta si usas alias "src/..."

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = '/api/v1/asistente';

  constructor(private http: HttpClient) {}

  // ⚠️ 🔒 Este endpoint está protegido. Coméntalo hasta tener autenticación (JWT o login)
  // obtenerClientes(): Observable<Cliente[]> {
  //   return this.http.get<Cliente[]>(`${this.baseUrl}/cliente`);
  // }

  // 🔎 Búsqueda por nombre (ya existente)
  buscarPorNombre(nombre: string): Observable<{ data: Cliente[] }> {
    return this.http.get<{ data: Cliente[] }>(`${this.baseUrl}/cliente/nombre/${nombre}`);
  }

  // ➕ Crear nuevo cliente
  crear(cliente: Cliente): Observable<{ data: Cliente }> {
    return this.http.post<{ data: Cliente }>(`${this.baseUrl}/crearCliente`, cliente);
  }
}
