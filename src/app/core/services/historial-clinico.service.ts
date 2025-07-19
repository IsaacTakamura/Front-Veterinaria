// core/services/historial-clinico.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Visita } from '../../components/shared/interfaces/historial.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistorialClinicoService {
  private apiAsistente = '/api/v1/asistente';
  private apiVet = '/api/v1/vet';

  constructor(private http: HttpClient) { }

  //* No olvidar que CasosClinicos es igual a HistorialClinico, pero así está en la API

  // Listar todos los casos clínicos por mascota id
  listarHistorialPorMascotaid(mascotaId: number): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiAsistente}/CasosClinicos/mascota/${mascotaId}`);
  }
  /* {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "casoClinicoId": 0,
      "descripcion": "string",
      "mascotaId": 0
    }
  ]
} */

  // Listar todas las visitas
  listarTodasVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiAsistente}/ListarTodasLasVisitas`);
  }
  /* {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "visitaId": 0,
      "casoClinicoId": 0,
      "signoVital": [
        {
          "signoVitalId": 0,
          "tipoSignoVital": {
            "tipoSignoVitalId": 0,
            "nombre": "string"
          },
          "valor": 0
        }
      ],
      "tipoVisitaId": 0
    }
  ] */

  //listar todos los casos clínicos para asistente
  listarTodosCasosClinicosAsistente(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiAsistente}/listarCasos`);
  }
  /* {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "casoClinicoId": 0,
      "descripcion": "string",
      "mascotaId": 0
    }
  ]
} */

  // Listar Casos Clínicos por id de caso clínico
  listarCasoClinicoPorId(casoClinicoId: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.apiAsistente}/listarCasoClinicos/${casoClinicoId}`);
  }
  /* {
  "codigo": 0,
  "message": "string",
  "data": {
    "casoClinicoId": 0,
    "descripcion": "string",
    "mascotaId": 0
  }
} */

  // Listar todos los servicios para asistente
  listarServiciosAsistente(): Observable<{ data: { servicioId: number; nombre: string }[] }> {
    return this.http.get<{ data: { servicioId: number; nombre: string }[] }>(`${this.apiAsistente}/ListarServicios`);
  }
  /* */

  // Listar servicios para veterinario
  listarServicios(): Observable<{ data: { servicioId: number; nombre: string }[] }> {
    return this.http.get<{ data: { servicioId: number; nombre: string }[] }>(`${this.apiVet}/ListarServicios`);
  }

  //! Crear tipo de visita para veterinario, si tiene esa palabra CreatTipoVisita no cambiar
  crearTipoVisita(tipoVisita: { nombre: string }): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiVet}/CreatTipoVisita`, tipoVisita);
  }
  /*
    espera algo como:
    {
  "tipoVisitaId": 0,
  "nombre": "string"
}
  */

  // Listar tipos de visita
  listarTiposVisita(): Observable<{ data: { tipoVisitaId: number; nombre: string }[] }> {
    return this.http.get<{ data: { tipoVisitaId: number; nombre: string }[] }>(`${this.apiVet}/listarTiposVisitas`);
  }
  /*
    se recibe algo como:
    {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "tipoVisitaId": 0,
      "nombre": "string"
    }
  ]
}
  */

  // Listar tipos de visita por id para veterinario
  listarTipoVisitaPorId(tipoVisitaId: number): Observable<{ data: { tipoVisitaId: number; nombre: string } }> {
    return this.http.get<{ data: { tipoVisitaId: number; nombre: string } }>(`${this.apiVet}/visita/tipoVisita/${tipoVisitaId}`);
  }
  /*{
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "visitaId": 0,
      "casoClinicoId": 0,
      "signoVital": [
        {
          "signoVitalId": 0,
          "tipoSignoVital": {
            "tipoSignoVitalId": 0,
            "nombre": "string"
          },
          "valor": 0
        }
      ],
      "tipoVisitaId": 0
    }
  ]
}*/

  // Crear visita para veterinario
  crearVisita(visita: Visita): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiVet}/crearVisita`, visita);
  }
  /*
    espera algo como:
    {
  "visitaId": 0,
  "casoClinicoId": 0,
  "signoVital": [
    {
      "signoVitalId": 0,
      "tipoSignoVital": {
        "tipoSignoVitalId": 0,
        "nombre": "string"
      },
      "valor": 0
    }
  ],
  "tipoVisitaId": 0
}
  */

  // Listar visita por id de visita para veterinario
  listarVisitaPorId(id: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.apiVet}/visita/${id}`);
  }
  /*
    recibe algo como:
    {
  "codigo": 0,
  "message": "string",
  "data": {
    "visitaId": 0,
    "casoClinicoId": 0,
    "signoVital": [
      {
        "signoVitalId": 0,
        "tipoSignoVital": {
          "tipoSignoVitalId": 0,
          "nombre": "string"
        },
        "valor": 0
      }
    ],
    "tipoVisitaId": 0
  }
}
  */

  //! Listar visitas para veterinario, no cambiar ruta porque al final si es listarVisitass
  listarVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiVet}/listarVisitass`);
  }
  /*
    Se recibe algo como:
    {
  "codigo": 0,
  "message": "string",
  "data": [
    {
      "visitaId": 0,
      "casoClinicoId": 0,
      "signoVital": [
        {
          "signoVitalId": 0,
          "tipoSignoVital": {
            "tipoSignoVitalId": 0,
            "nombre": "string"
          },
          "valor": 0
        }
      ],
      "tipoVisitaId": 0
    }
  ]
}
  */

  // Actualizar Caso Clínico
  actualizarCasoClinico(casoClinicoId: number, casoClinico: Visita): Observable<{ data: any }> {
    return this.http.put<{ data: any }>(`${this.apiVet}/actualizarCaso`, casoClinico);
  }

  // Registrar Caso Clínico
  registrarCasoClinico(casoClinico: Visita): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${this.apiVet}/RegistrarCasoClinico`, casoClinico);
  }

  // Listar todos los casos clínicos
  listarCasosClinicos(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiVet}/listarCasosClinicos`);
  }

  // Listar casos clínicos por mascotaId
  listarCasosClinicosPorMascotaId(mascotaId: number): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiVet}/CasoClinico/mascota/${mascotaId}`);
  }
}
