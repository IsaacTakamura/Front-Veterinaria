import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CitaService } from 'src/app/core/services/cita.service';
import { Cita } from '../../shared/interfaces/cita.model';

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
    this.citaService.listarCitasHoyVeterinario().subscribe((citas: Cita[]) => {
      console.log('Citas recibidas en el dashboard:', citas);
      this.stats.todayAppointments = citas.length;
      this.stats.pendingConsultations = citas.filter(c => c.estadoCita === 'PENDIENTE').length;
      this.stats.completedToday = citas.filter(c => c.estadoCita === 'COMPLETADA').length;
      this.stats.emergencies = citas.filter(c => c.motivo?.toLowerCase() === 'emergencia').length;

      // Mapear las citas a la estructura de Appointment para el listado visual
      this.todayAppointments = citas.map(cita => ({
        id: cita.citaId ?? 0, // Asegura que siempre sea un número
        time: cita.fechaRegistro.substring(11, 16), // Extrae la hora en formato HH:mm
        pet: 'Mascota', // Aquí deberías buscar el nombre real de la mascota si lo tienes
        owner: 'Cliente', // Aquí deberías buscar el nombre real del cliente si lo tienes
        type: cita.motivo,
        status: cita.estadoCita.toLowerCase() as any
      }));
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
