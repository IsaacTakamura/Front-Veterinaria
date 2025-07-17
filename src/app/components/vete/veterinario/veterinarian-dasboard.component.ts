import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CitaService } from 'src/app/core/services/cita.service';
import { MascotaService } from 'src/app/core/services/mascota.service';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { forkJoin } from 'rxjs';
import { Cita } from '../../shared/interfaces/cita.model';
import { Mascota } from '../../shared/interfaces/mascota.model';
import { Cliente } from '../../shared/interfaces/cliente.model';

interface Appointment {
  id: number;
  time: string;
  pet: string;
  owner: string;
  type: string;
  status: 'completed' | 'in-progress' | 'pending';
}

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
  ],
  templateUrl: './veterinarian-dashboard.component.html',
  styleUrls: ['./veterinarian-dashboard.component.css']
})
export class VeterinarianDashboardComponent implements OnInit {
  todayDate = new Date();

  citaService = inject(CitaService);
  mascotaService = inject(MascotaService);
  clienteService = inject(ClienteService);

  stats = {
    todayAppointments: 0,
    pendingConsultations: 0,
    completedToday: 0,
    emergencies: 0,
  };

  todayAppointments: Appointment[] = [];

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

  ngOnInit(): void {
    const veterinarioId = 1; // Reemplaza esto por la obtención dinámica del ID si lo tienes
    this.citaService.listarCitasHoyVeterinario().subscribe((citas: Cita[]) => {
      console.log('Citas recibidas en el dashboard:', citas);
      this.stats.todayAppointments = citas.length;
      this.stats.pendingConsultations = citas.filter(c => c.estadoCita === 'PENDIENTE').length;
      this.stats.completedToday = citas.filter(c => c.estadoCita === 'COMPLETADA').length;
      this.stats.emergencies = citas.filter(c => c.motivo?.toLowerCase() === 'emergencia').length;

      // Obtener todas las mascotas del veterinario
      this.mascotaService.listarMascotasVet().subscribe((mascotasResponse: any) => {
        const mascotas = mascotasResponse.data;
        console.log('Mascotas del veterinario:', mascotas);

        // Procesar las citas con los datos de mascotas disponibles
        this.todayAppointments = citas.map(cita => {
          // Buscar la mascota correspondiente
          const mascota = mascotas.find((m: any) => m.mascotaId === cita.mascotaId);

          return {
            id: cita.citaId ?? 0,
            time: cita.fechaRegistro.substring(11, 16),
            pet: mascota?.nombre || 'Mascota',
            owner: 'Cliente', // Temporalmente mostramos "Cliente" hasta que se resuelva el problema de permisos
            type: cita.motivo,
            status: cita.estadoCita.toLowerCase() as any
          };
        });

        console.log('Citas procesadas con datos de mascotas:', this.todayAppointments);
      });
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in-progress': return 'En Proceso';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  }
  // Property to control modal visibility
  showBuscadorMascota = true;

  openBuscadorMascota() {
    this.showBuscadorMascota = true;
  }

  closeBuscadorMascota() {
    this.showBuscadorMascota = false;
  }
}
