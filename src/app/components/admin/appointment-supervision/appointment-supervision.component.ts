import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-appointment-supervision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-supervision.component.html',
  styleUrls: ['./appointment-supervision.component.css']
})
export class AppointmentSupervisionComponent {
  @Input() activeTab!: string;

  citas = [
    {
      id: 1,
      hora: "09:00",
      paciente: "Max",
      propietario: "Juan Pérez",
      veterinario: "Dr. Martínez",
      estado: "confirmada",
    },
    {
      id: 2,
      hora: "10:30",
      paciente: "Luna",
      propietario: "María García",
      veterinario: "Dra. López",
      estado: "pendiente",
    },
    {
      id: 3,
      hora: "11:15",
      paciente: "Rocky",
      propietario: "Carlos Ruiz",
      veterinario: "Dr. Martínez",
      estado: "en-proceso",
    },
  ];

  getEstadoBadgeClass(estado: string): string {
    if (estado === 'confirmada') return 'bg-green-100 text-green-800';
    if (estado === 'pendiente') return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  }
}
