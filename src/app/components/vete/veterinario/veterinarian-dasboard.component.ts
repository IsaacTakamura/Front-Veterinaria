import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CitaService } from 'src/app/core/services/cita.service';
import { MascotaService } from 'src/app/core/services/mascota.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cita } from '../../shared/interfaces/cita.model';
import { Mascota } from '../../shared/interfaces/mascota.model';
import { Cliente } from '../../shared/interfaces/cliente.model';
import { Observable } from 'rxjs';
import { VeteModalCitasHoyComponent } from '../vete-modal-citasHoy/vete-modal-citasHoy.component';
import { BuscadorMascotaComponent } from '../buscador-mascota/buscador-mascota.component';
import { CitaConNombres } from '../../shared/interfaces/cita-con-nombres.model';

interface Patient {
  id: number;
  name: string;
  species: string;
  breed: string;
  lastVisit: string;
}

@Component({
  selector: 'app-veterinarian-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    VeteModalCitasHoyComponent,
  ],
  templateUrl: './veterinarian-dashboard.component.html',
  styleUrls: ['./veterinarian-dashboard.component.css']
})
export class VeterinarianDashboardComponent implements OnInit {
  todayDate = new Date();

  stats = {
    todayAppointments: 0,
    pendingConsultations: 0,
    completedToday: 0,
    emergencies: 0,
  };

  todayAppointments: CitaConNombres[] = [];
  loadingCitas = false;
  errorCitas = '';

  showModalCitasHoy = false;

  // --- Búsqueda de pacientes ---
  recentPatients: Patient[] = [
    { id: 1, name: 'Max', species: 'Perro', breed: 'Golden Retriever', lastVisit: '2024-01-15' },
    { id: 2, name: 'Luna', species: 'Gato', breed: 'Siamés', lastVisit: '2024-01-14' },
    { id: 3, name: 'Rocky', species: 'Perro', breed: 'Bulldog', lastVisit: '2024-01-13' }
  ];
  searchTerm = signal('');
  filteredPatients = computed(() =>
    this.recentPatients.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );
  // -----------------------------

  ngOnInit(): void {
    this.cargarCitasHoy();
  }

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private clienteService: ClienteService
  ) {}

  cargarCitasHoy() {
    this.loadingCitas = true;
    this.errorCitas = '';
    this.citaService.listarCitasHoyVeterinario().subscribe({
      next: (citas: Cita[]) => {
        // Mapear cada cita para obtener los nombres
        const citasConNombres: CitaConNombres[] = [];
        let pendientes = citas.length;
        if (citas.length === 0) {
          this.todayAppointments = [];
          this.stats.todayAppointments = 0;
          this.stats.pendingConsultations = 0;
          this.stats.completedToday = 0;
          this.stats.emergencies = 0;
          this.loadingCitas = false;
          return;
        }
        citas.forEach((cita, idx) => {
          const citaConNombres: CitaConNombres = { ...cita };
          // Obtener nombre de mascota
          this.mascotaService.listarMascotaPorId(cita.mascotaId).subscribe({
            next: (resMascota: { data: Mascota }) => {
              citaConNombres.nombreMascota = resMascota.data.nombre;
              // Obtener nombre de cliente
              this.clienteService.listarClientePorId(cita.clienteId).subscribe({
                next: (resCliente: { data: Cliente }) => {
                  citaConNombres.nombreCliente = resCliente.data.nombre + ' ' + (resCliente.data.apellido || '');
                  citasConNombres[idx] = citaConNombres;
                  pendientes--;
                  if (pendientes === 0) {
                    this.todayAppointments = citasConNombres;
                    this.stats.todayAppointments = citasConNombres.length;
                    this.stats.pendingConsultations = citasConNombres.filter((c: CitaConNombres) => c.estadoCita === 'PENDIENTE').length;
                    this.stats.completedToday = citasConNombres.filter((c: CitaConNombres) => c.estadoCita === 'COMPLETADA').length;
                    this.stats.emergencies = citasConNombres.filter((c: CitaConNombres) => c.motivo?.toLowerCase().includes('emergencia')).length;
                    this.loadingCitas = false;
                  }
                },
                error: () => {
                  citaConNombres.nombreCliente = 'Desconocido';
                  citasConNombres[idx] = citaConNombres;
                  pendientes--;
                  if (pendientes === 0) {
                    this.todayAppointments = citasConNombres;
                    this.stats.todayAppointments = citasConNombres.length;
                    this.stats.pendingConsultations = citasConNombres.filter((c: CitaConNombres) => c.estadoCita === 'PENDIENTE').length;
                    this.stats.completedToday = citasConNombres.filter((c: CitaConNombres) => c.estadoCita === 'COMPLETADA').length;
                    this.stats.emergencies = citasConNombres.filter((c: CitaConNombres) => c.motivo?.toLowerCase().includes('emergencia')).length;
                    this.loadingCitas = false;
                  }
                }
              });
            },
            error: () => {
              citaConNombres.nombreMascota = 'Desconocido';
              // Intentar aún así obtener el cliente
              this.clienteService.listarClientePorId(cita.clienteId).subscribe({
                next: (resCliente: { data: Cliente }) => {
                  citaConNombres.nombreCliente = resCliente.data.nombre + ' ' + (resCliente.data.apellido || '');
                  citasConNombres[idx] = citaConNombres;
                  pendientes--;
                  if (pendientes === 0) {
                    this.todayAppointments = citasConNombres;
                    this.stats.todayAppointments = citasConNombres.length;
                    this.stats.pendingConsultations = citasConNombres.filter((c: CitaConNombres) => c.estadoCita === 'PENDIENTE').length;
                    this.stats.completedToday = citasConNombres.filter((c: CitaConNombres) => c.estadoCita === 'COMPLETADA').length;
                    this.stats.emergencies = citasConNombres.filter((c: CitaConNombres) => c.motivo?.toLowerCase().includes('emergencia')).length;
                    this.loadingCitas = false;
                  }
                },
                error: () => {
                  citaConNombres.nombreCliente = 'Desconocido';
                  citasConNombres[idx] = citaConNombres;
                  pendientes--;
                  if (pendientes === 0) {
                    this.todayAppointments = citasConNombres;
                    this.stats.todayAppointments = citasConNombres.length;
                    this.stats.pendingConsultations = citasConNombres.filter((c: CitaConNombres) => c.estadoCita === 'PENDIENTE').length;
                    this.stats.completedToday = citasConNombres.filter((c: CitaConNombres) => c.estadoCita === 'COMPLETADA').length;
                    this.stats.emergencies = citasConNombres.filter((c: CitaConNombres) => c.motivo?.toLowerCase().includes('emergencia')).length;
                    this.loadingCitas = false;
                  }
                }
              });
            }
          });
        });
      },
      error: (err: any) => {
        this.errorCitas = 'No se pudieron cargar las citas de hoy.';
        this.loadingCitas = false;
      }
    });
  }

  get primeras4Citas(): CitaConNombres[] {
    return this.todayAppointments.slice(0, 4);
  }

  get hayMasDe4Citas(): boolean {
    return this.todayAppointments.length > 4;
  }

  abrirModalCitasHoy() {
    this.showModalCitasHoy = true;
  }

  cerrarModalCitasHoy() {
    this.showModalCitasHoy = false;
  }

  openBuscadorMascota() {
    // Aquí puedes abrir un modal o implementar la lógica deseada
    console.log('Abrir buscador de mascota');
  }
}
