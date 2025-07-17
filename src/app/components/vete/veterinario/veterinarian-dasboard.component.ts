import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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
export class VeterinarianDashboardComponent {
  todayDate = new Date();

  stats = {
    todayAppointments: 8,
    pendingConsultations: 4,
    completedToday: 3,
    emergencies: 1,
  };

  todayAppointments: Appointment[] = [
    { id: 1, time: '09:00', pet: 'Max', owner: 'Juan Pérez', type: 'Consulta', status: 'pending' },
    { id: 2, time: '10:30', pet: 'Luna', owner: 'María García', type: 'Vacunación', status: 'completed' },
    { id: 3, time: '11:15', pet: 'Rocky', owner: 'Carlos López', type: 'Cirugía', status: 'in-progress' },
    { id: 4, time: '14:00', pet: 'Bella', owner: 'Ana Martínez', type: 'Control', status: 'pending' }
  ];

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
