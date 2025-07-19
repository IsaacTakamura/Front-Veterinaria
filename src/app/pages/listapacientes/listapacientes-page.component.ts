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
import { SignosVitalesService } from 'src/app/core/services/signosVitales.service';
import { Triaje } from 'src/app/components/shared/interfaces/triaje.model';
import { Visita, TipoVisita, CasoClinico } from 'src/app/components/shared/interfaces/historial.model';
import { TipoSignoVital } from 'src/app/components/shared/interfaces/tipoSignoVital';
import { SignoVital } from 'src/app/components/shared/interfaces/SignoVital.model';
import { PacienteInfo } from 'src/app/components/shared/interfaces/paciente-info.model';
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
  tiposSignoVital: TipoSignoVital[] = [];
  signosVitalesNuevaConsulta: any[] = [];
  citaActual: Cita | null = null; // Agregamos la cita actual
  pacienteInfo: PacienteInfo | null = null; // Paciente mapeado para info-paciente

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private clienteService: ClienteService,
    private triajeService: TriajeService,
    private historialClinicoService: HistorialClinicoService,
    private signosVitalesService: SignosVitalesService
  ) {}

  ngOnInit(): void {
    this.cargarPacientesCitasHoy();
    this.cargarTiposSignoVital();
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

  cargarTiposSignoVital() {
    console.log('🔄 Cargando tipos de signos vitales...');

    this.signosVitalesService.listarTiposSignosVitales().subscribe({
      next: (response) => {
        console.log('📥 Respuesta del backend:', response);

        // Manejar diferentes formatos de respuesta
        if (Array.isArray(response)) {
          this.tiposSignoVital = response;
        } else if (response && (response as any)?.data) {
          this.tiposSignoVital = (response as any).data;
        } else {
          this.tiposSignoVital = [];
        }

        console.log('✅ Tipos de signos vitales cargados:', this.tiposSignoVital);
      },
      error: (error) => {
        console.error('❌ Error al cargar tipos de signos vitales:', error);
        this.tiposSignoVital = [];
      }
    });
  }

    onNuevoTipoSignoVital(nombre: string) {
    console.log('🔄 Creando nuevo tipo de signo vital:', nombre);

    // Crear objeto simple como en crearTipoVisita
    const nuevoTipo = {
      nombre: nombre.trim()
    };

    console.log('📤 Enviando al backend:', nuevoTipo);

    this.signosVitalesService.crearTipoSignoVital(nuevoTipo as any).subscribe({
      next: (response) => {
        console.log('✅ Tipo de signo vital creado exitosamente:', response);
        // Recargar la lista de tipos
        this.cargarTiposSignoVital();
        alert('✅ Nuevo tipo de signo vital creado exitosamente');
      },
      error: (error) => {
        console.error('❌ Error al crear nuevo tipo de signo vital:', error);
        console.error('Detalles del error:', error);
        alert('❌ Error al crear nuevo tipo de signo vital. Revisa la consola para más detalles.');
      }
    });
  }

  onSignosVitalesChange(signosVitales: any[]) {
    this.signosVitalesNuevaConsulta = signosVitales;
  }

  // Manejar cuando se complete la cita
  onCitaCompletada(citaActualizada: Cita) {
    console.log('✅ Cita completada exitosamente:', citaActualizada);
    this.citaActual = citaActualizada;

    // Mostrar mensaje de éxito (puedes implementar un toast o alert)
    alert('✅ Consulta registrada y cita marcada como COMPLETADA');

    // Opcional: recargar la lista de pacientes para reflejar el cambio
    this.cargarPacientesCitasHoy();
  }

  // Mapear PacienteCitaHoy a PacienteInfo
  mapearPacienteInfo(paciente: PacienteCitaHoy): PacienteInfo {
    return {
      nombreMascota: paciente.nombreMascota,
      edad: paciente.edad,
      raza: paciente.raza,
      especie: paciente.especie,
      propietario: paciente.propietario,
      mascotaId: paciente.mascotaId,
      clienteId: paciente.clienteId,
      telefono: paciente.telefono,
      fechaRegistro: paciente.fechaRegistro
    };
  }

  cambiarVista(v: 'pacientes' | 'consulta' | 'seguimiento') {
    this.selected = v;
    this.pacienteSeleccionado = null;
    this.pacienteInfo = null; // Limpiar también el paciente mapeado
    this.subvista = 'info';
  }

  cambiarSubvista(v: 'info' | 'triaje' | 'visitas' | 'nueva') {
    this.subvista = v;
  }

  seleccionarPaciente(p: PacienteCitaHoy) {
    this.pacienteSeleccionado = p;
    this.pacienteInfo = this.mapearPacienteInfo(p); // Mapear para info-paciente
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
    this.signosVitalesNuevaConsulta = [];
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
      this.buscarCitaActual(p.mascotaId); // Buscar la cita actual
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

  // Buscar la cita actual de la mascota
  buscarCitaActual(mascotaId: number) {
    this.citaService.listarCitasHoyVeterinario().subscribe({
      next: (citas) => {
        console.log('Citas de hoy:', citas);
        // Buscar la cita que corresponda a esta mascota
        this.citaActual = citas.find(cita => cita.mascotaId === mascotaId) || null;
        console.log('Cita actual encontrada:', this.citaActual);
      },
      error: (error) => {
        console.error('Error al buscar cita actual:', error);
        this.citaActual = null;
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
            next: (respVisita: any) => {
              const visitaId = respVisita.data?.visitaId;
              if (visitaId && this.signosVitalesNuevaConsulta.length > 0) {
                // Registrar los signos vitales
                const signosPromises = this.signosVitalesNuevaConsulta.map(sv => {
                  const nuevoSigno: any = {
                    tipoSignoVitalId: sv.tipo.tipoSignoVitalId,
                    valor: parseFloat(sv.valor),
                    visitaId: visitaId
                  };
                  return this.signosVitalesService.crearSignoVital(nuevoSigno as any).toPromise();
                });

                Promise.all(signosPromises).then(() => {
                  this.cargarHistorialVisitas(this.pacienteSeleccionado!.mascotaId);
                  this.cargarCasosClinicos(this.pacienteSeleccionado!.mascotaId);
                  this.descripcionNuevaConsulta = '';
                  this.tipoVisitaNuevaConsulta = null;
                  this.signosVitalesNuevaConsulta = [];
                });
              } else {
                this.cargarHistorialVisitas(this.pacienteSeleccionado!.mascotaId);
                this.cargarCasosClinicos(this.pacienteSeleccionado!.mascotaId);
                this.descripcionNuevaConsulta = '';
                this.tipoVisitaNuevaConsulta = null;
                this.signosVitalesNuevaConsulta = [];
              }
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

