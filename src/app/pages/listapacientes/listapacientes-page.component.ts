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

export interface PacienteCitaHoy {
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
    IconDocumentComponent
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
  subvista: 'info' | 'alergias' | 'nueva' = 'info';

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private clienteService: ClienteService
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

  cambiarSubvista(v: 'info' | 'alergias' | 'nueva') {
    this.subvista = v;
  }

  seleccionarPaciente(p: PacienteCitaHoy) {
    this.pacienteSeleccionado = p;
    this.subvista = 'info';
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
