import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tratamiento } from 'src/app/components/shared/interfaces/tratamiento.model';
import { MascotaService } from 'src/app/core/services/mascota.service';
import { CitaService } from 'src/app/core/services/cita.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Raza } from 'src/app/components/shared/interfaces/Raza.model';
import { Cita } from 'src/app/components/shared/interfaces/cita.model';
import { Cliente } from 'src/app/components/shared/interfaces/cliente.model';
import { Mascota } from 'src/app/components/shared/interfaces/mascota.model';
import { forkJoin } from 'rxjs';
import { IconListapacientesComponent } from 'src/app/components/icons/icon-listapacientes.component';
import { IconVetDashboardComponent } from 'src/app/components/icons/icon-vet-dashboard.component';
import { IconStethoscopeComponent } from 'src/app/components/icons/icon-stethoscope.component';
import { IconCalendarComponent } from 'src/app/components/icons/icon-calendar.component';
import { IconUsersComponent } from 'src/app/components/icons/icon-users.Component';
import { IconShieldComponent } from 'src/app/components/icons/icon-shield.component';
import { IconDocumentComponent } from 'src/app/components/icons/icon-document.component';
import { TriajeService } from 'src/app/core/services/triaje.service';
import { HistorialClinicoService } from 'src/app/core/services/historial-clinico.service';
import { Triaje } from 'src/app/components/shared/interfaces/triaje.model';
import { Visita, TipoVisita, CasoClinico } from 'src/app/components/shared/interfaces/historial.model';
import { InfoPacienteComponent } from '../../components/listapacientes/info-paciente/info-paciente.component';
import { TriajeActualComponent } from '../../components/listapacientes/triaje-actual/triaje-actual.component';
import { VisitasCasosComponent } from '../../components/listapacientes/visitas-casos/visitas-casos.component';
import { NuevaConsultaComponent } from '../../components/listapacientes/nueva-consulta/nueva-consulta.component';

export interface PacienteCitaHoy {
  clienteId: number;
  mascotaId: number; // <--- NUEVO
  nombreMascota: string;
  especie: string;
  raza: string;
  edad: number;
  propietario: string;
  telefono: string;
  fechaRegistro: string;
}

@Component({
  selector: 'app-listapacientes-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconListapacientesComponent,
    IconVetDashboardComponent,
    IconStethoscopeComponent,
    IconCalendarComponent,
    IconUsersComponent,
    IconShieldComponent,
    IconDocumentComponent,
    InfoPacienteComponent,
    TriajeActualComponent,
    VisitasCasosComponent,
    NuevaConsultaComponent
  ],
  templateUrl: './listapacientes-page.component.html',
  styleUrls: ['./listapacientes-page.component.css']
})
export class ListapacientesPageComponent implements OnInit {
  pacientes = signal<PacienteCitaHoy[]>([]);
  tratamientos = signal<Tratamiento[]>([]);
  busqueda: string = '';
  selected: 'pacientes' | 'consulta' | 'seguimiento' = 'pacientes';
  pacienteSeleccionado: PacienteCitaHoy | null = null;
  subvista: 'info' | 'triaje' | 'visitas' | 'nueva' = 'info';
  propietarioSeleccionado: Cliente | null = null; // <--- NUEVO
  triajeMascota: Triaje | null = null;
  cargandoTriaje: boolean = false;
  modoEdicionTriaje: boolean = false;
  historialVisitas: Visita[] = [];
  tiposVisita: TipoVisita[] = [];
  casosClinicos: CasoClinico[] = [];
  visitaSeleccionada: Visita | null = null;
  tipoVisitaSeleccionado: TipoVisita | null = null;
  casoClinicoSeleccionado: CasoClinico | null = null;
  descripcionNuevaConsulta: string = '';
  tipoVisitaNuevaConsulta: TipoVisita | null = null;

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private clienteService: ClienteService,
    private triajeService: TriajeService,
    private historialClinicoService: HistorialClinicoService
  ) {}

  ngOnInit(): void {
    this.cargarPacientesCitasHoy();
  }

  cargarPacientesCitasHoy() {
    this.citaService.listarCitasHoyVeterinario().subscribe({
      next: (citas: Cita[]) => {
        if (!citas || citas.length === 0) {
          this.pacientes.set([]);
          return;
        }
        // Obtener todas las razas una sola vez (endpoint veterinario)
        this.mascotaService.listarRazasVeterinario().subscribe({
          next: (razasResp: any) => {
            // Si la respuesta viene como { data: Raza[] }, extraer el array
            const razas: Raza[] = Array.isArray(razasResp) ? razasResp : razasResp.data;
            // Para cada cita, obtener mascota y cliente
            const mascotaRequests = citas.map(c => this.mascotaService.listarMascotaPorIdVeterinario(c.mascotaId));
            const clienteRequests = citas.map(c => this.clienteService.listarClientePorIdVeterinario(c.clienteId));
            forkJoin([...mascotaRequests, ...clienteRequests]).subscribe(respuestas => {
              const mascotas = respuestas.slice(0, citas.length).map((r: any) => r.data as Mascota);
              const clientes = respuestas.slice(citas.length).map((r: any) => r.data as Cliente);
              const pacientesHoy: PacienteCitaHoy[] = citas.map((cita, i) => {
                const mascota = mascotas[i];
                const cliente = clientes[i];
                const raza = razas.find(r => r.razaId === mascota.razaId);
                return {
                  clienteId: cliente?.clienteId || 0,
                  mascotaId: mascota?.mascotaId || 0, // <--- NUEVO
                  nombreMascota: mascota?.nombre || '',
                  especie: raza ? (raza.especieId === 1 ? 'Perro' : 'Gato') : '',
                  raza: raza?.nombre || '',
                  edad: mascota?.edad || 0,
                  propietario: cliente ? `${cliente.nombre} ${cliente.apellido}` : '',
                  telefono: cliente?.telefono || '',
                  fechaRegistro: cita.fechaRegistro.split('T')[0],
                };
              });
              this.pacientes.set(pacientesHoy);
            });
          },
          error: (err) => {
            this.pacientes.set([]);
          }
        });
      },
      error: (err) => {
        this.pacientes.set([]);
      }
    });
  }

  cambiarVista(v: 'pacientes' | 'consulta' | 'seguimiento') {
    this.selected = v;
    this.pacienteSeleccionado = null;
    this.subvista = 'info';
  }

  cambiarSubvista(v: 'info' | 'triaje' | 'visitas' | 'nueva') {
    this.subvista = v;
  }

  seleccionarPaciente(p: PacienteCitaHoy) {
    this.pacienteSeleccionado = p;
    this.subvista = 'info';
    this.propietarioSeleccionado = null;
    this.triajeMascota = null;
    this.historialVisitas = [];
    this.tiposVisita = [];
    this.casosClinicos = [];
    this.visitaSeleccionada = null;
    this.tipoVisitaSeleccionado = null;
    this.casoClinicoSeleccionado = null;
    this.descripcionNuevaConsulta = '';
    this.tipoVisitaNuevaConsulta = null;
    // Buscar información completa del propietario
    if (p && p.clienteId) {
      this.clienteService.listarClientePorIdVeterinario(p.clienteId).subscribe({
        next: (resp) => {
          this.propietarioSeleccionado = resp.data;
        },
        error: () => {
          this.propietarioSeleccionado = null;
        }
      });
    }
    // Cargar triaje de la mascota
    if (p && p.mascotaId) {
      this.cargarTriajeMascota(p.mascotaId);
      this.cargarHistorialVisitas(p.mascotaId);
      this.cargarTiposVisita();
      this.cargarCasosClinicos(p.mascotaId);
    }
  }

  cargarTriajeMascota(mascotaId: number) {
    this.cargandoTriaje = true;
    this.triajeService.listarTriajePorMascotaIdVeterinario(mascotaId).subscribe({
      next: (response) => {
        // Manejar tanto si viene como array directo o envuelto en objeto
        const triajes = Array.isArray(response) ? response : (response as any)?.data || [];
        this.triajeMascota = triajes && triajes.length > 0 ? triajes[0] : null;
        this.cargandoTriaje = false;
      },
      error: () => {
        this.triajeMascota = null;
        this.cargandoTriaje = false;
      }
    });
  }

  actualizarTriajeMascota(triaje: Triaje) {
    if (!triaje.triajeId) return;
    this.triajeService.actualizarTriajeVeterinario(triaje.triajeId, triaje).subscribe({
      next: (nuevoTriaje) => {
        this.triajeMascota = nuevoTriaje;
        this.modoEdicionTriaje = false;
      }
    });
  }

  cargarHistorialVisitas(mascotaId: number) {
    this.historialClinicoService.listarCasosClinicosPorMascotaId(mascotaId).subscribe({
      next: (response) => {
        // Manejar tanto si viene como array directo o envuelto en objeto
        this.historialVisitas = Array.isArray(response) ? response : (response as any)?.data || [];
      },
      error: () => {
        this.historialVisitas = [];
      }
    });
  }

  cargarTiposVisita() {
    this.historialClinicoService.listarTiposVisita().subscribe({
      next: (resp) => {
        this.tiposVisita = resp.data || [];
      },
      error: () => {
        this.tiposVisita = [];
      }
    });
  }

  cargarCasosClinicos(mascotaId: number) {
    this.historialClinicoService.listarCasosClinicosPorMascotaId(mascotaId).subscribe({
      next: (response) => {
        // Manejar tanto si viene como array directo o envuelto en objeto
        const visitas = Array.isArray(response) ? response : (response as any)?.data || [];
        // Extraer casos clínicos únicos de las visitas
        const casosMap = new Map<number, CasoClinico>();
        visitas.forEach((v: any) => {
          if (v.casoClinico && !casosMap.has(v.casoClinico.casoClinicoId)) {
            casosMap.set(v.casoClinico.casoClinicoId, v.casoClinico);
          }
        });
        this.casosClinicos = Array.from(casosMap.values());
      },
      error: () => {
        this.casosClinicos = [];
      }
    });
  }

  registrarNuevaConsulta() {
    if (!this.pacienteSeleccionado || !this.tipoVisitaNuevaConsulta || !this.descripcionNuevaConsulta) return;
    // Primero registrar el caso clínico
    const nuevoCaso: Partial<CasoClinico> = {
      descripcion: this.descripcionNuevaConsulta,
      mascotaId: this.pacienteSeleccionado.mascotaId
    };
    // Usar el método registrarCasoClinico que espera un CasoClinico
    (this.historialClinicoService as any).registrarCasoClinico(nuevoCaso).subscribe({
      next: (resp: any) => {
        const casoId = resp.data?.casoClinicoId;
        if (casoId) {
          // Luego registrar la visita
          const nuevaVisita = {
            casoClinicoId: casoId,
            tipoVisitaId: this.tipoVisitaNuevaConsulta!.tipoVisitaId
          };
          this.historialClinicoService.crearVisita(nuevaVisita as any).subscribe({
            next: () => {
              this.cargarHistorialVisitas(this.pacienteSeleccionado!.mascotaId);
              this.cargarCasosClinicos(this.pacienteSeleccionado!.mascotaId);
              this.descripcionNuevaConsulta = '';
              this.tipoVisitaNuevaConsulta = null;
            }
          });
        }
      }
    });
  }

  get pacientesFiltrados(): PacienteCitaHoy[] {
    const q = this.busqueda.trim().toLowerCase();
    return this.pacientes().filter(p =>
      p.nombreMascota.toLowerCase().includes(q) ||
      p.raza.toLowerCase().includes(q) ||
      p.propietario.toLowerCase().includes(q)
    );
  }

  getEmojiForStatus(status: string): string {
    switch (status) {
      case 'Activo': return '🟢';
      case 'Próximo a vencer': return '⚠️';
      case 'Completado': return '✅';
      case 'Vencido': return '⛔';
      default: return '❓';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo': return 'activo';
      case 'Próximo a vencer': return 'proximo';
      case 'Completado': return 'completado';
      case 'Vencido': return 'vencido';
      default: return 'desconocido';
    }
  }
}

