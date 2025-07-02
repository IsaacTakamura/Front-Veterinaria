import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listapacientes-page.component.html',
  styleUrls: ['./listapacientes-page.component.css']
})
export class ListapacientesPageComponent {
  selected = 'pacientes';
  busqueda = '';

  pacientes = [
    {
      nombre: 'Max',
      especie: 'Perro',
      raza: 'Golden Retriever',
      edad: '3 años',
      propietario: 'María González',
      telefono: '987654321',
      ultimaVisita: '2024-01-15',
      proximaCita: '2024-01-25',
      estado: 'Activo',
    },
    {
      nombre: 'Luna',
      especie: 'Gato',
      raza: 'Persa',
      edad: '2 años',
      propietario: 'Carlos Rodríguez',
      telefono: '987654322',
      ultimaVisita: '2024-01-10',
      proximaCita: '2024-01-20',
      estado: 'Inactivo',
    },
  ];

  tratamientos = [
    {
      paciente: 'Max',
      propietario: 'María González',
      tratamiento: 'Omeprazol 20mg cada 12h',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-01-22',
      status: 'Activo',
      diasRestantes: 3,
      proximaDosis: '2024-01-19 08:00',
    },
    {
      paciente: 'Luna',
      propietario: 'Carlos Rodríguez',
      tratamiento: 'Antibiótico - Amoxicilina 250mg cada 8h',
      fechaInicio: '2024-01-10',
      fechaFin: '2024-01-20',
      status: 'Próximo a vencer',
      diasRestantes: 1,
      proximaDosis: '2024-01-19 14:00',
    },

    {
      paciente: 'Rocky',
      propietario: 'Ana Martínez',
      tratamiento: 'Control post-vacunación',
      fechaInicio: '2024-01-10',
      fechaFin: '2024-01-17',
      status: 'Completado',
      diasRestantes: 0,
      proximaDosis: null,
    },

  ];

  cambiarVista(vista: string) {
    this.selected = vista;
  }

  getIconClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'fa-pills';
      case 'Próximo a vencer':
        return 'fa-triangle-exclamation';
      case 'Completado':
        return 'fa-check-circle';
      default:
        return 'fa-clock';
    }
  }

  getEmojiForStatus(status: string): string {
  switch (status) {
    case 'Activo':
      return '🟢'; // o '🔗'
    case 'Próximo a vencer':
      return '⚠️';
    case 'Completado':
      return '✅';
    case 'Vencido':
      return '⛔';
    default:
      return '❓';
  }
}


  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'activo';
      case 'Próximo a vencer':
        return 'proximo';
      case 'Completado':
        return 'completado';
      default:
        return 'inactivo';
    }
  }
}

// ¡ESTE ES TU PUNTO DE ENTRADA!
bootstrapApplication(ListapacientesPageComponent)
  .catch(err => console.error(err));
