// citas-hoy.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaCitasComponent } from '../tabla/tabla-citas.component';
import { TriajeModalComponent } from '../triaje/triaje-modal.component';
import { HistorialModalComponent } from '../historial/historial-modal.component';
import { DetallesCitaModalComponent } from '../detalles-cita/detalles-cita-modal.component';
// Datos de ejemplo para las citas de hoy (CitaTabla[])
import { CitaTabla } from '../../shared/interfaces/cita-tabla.model';

const CITAS_HOY: CitaTabla[] = [
  {
    citaId: 1,
    fechaRegistro: '2024-06-01T09:00:00',
    tipoServicioId: 1,
    mascotaId: 101,
    clienteId: 201,
    veterinarioId: 301,
    motivo: 'Vacunación',
    estadoCita: 'PENDIENTE',
    paciente: 'Max',
    especie: 'Perro',
    raza: 'Labrador',
    propietario: 'Juan Pérez',
  },
  {
    citaId: 2,
    fechaRegistro: '2024-06-01T09:30:00',
    tipoServicioId: 2,
    mascotaId: 102,
    clienteId: 202,
    veterinarioId: 302,
    motivo: 'Control',
    estadoCita: 'TRIAJE',
    paciente: 'Luna',
    especie: 'Gato',
    raza: 'Siamés',
    propietario: 'María García',
  },
  {
    citaId: 3,
    fechaRegistro: '2024-06-01T10:00:00',
    tipoServicioId: 1,
    mascotaId: 103,
    clienteId: 203,
    veterinarioId: 303,
    motivo: 'Consulta general',
    estadoCita: 'CONVETERINARIO',
    paciente: 'Rocky',
    especie: 'Perro',
    raza: 'Bulldog',
    propietario: 'Carlos López',
  },
  {
    citaId: 4,
    fechaRegistro: '2024-06-01T10:30:00',
    tipoServicioId: 3,
    mascotaId: 104,
    clienteId: 204,
    veterinarioId: 304,
    motivo: 'Desparasitación',
    estadoCita: 'COMPLETADA',
    paciente: 'Michi',
    especie: 'Gato',
    raza: 'Persa',
    propietario: 'Ana Martínez',
  },
  {
    citaId: 5,
    fechaRegistro: '2024-06-01T11:00:00',
    tipoServicioId: 1,
    mascotaId: 105,
    clienteId: 205,
    veterinarioId: 305,
    motivo: 'Vacunación',
    estadoCita: 'PENDIENTE',
    paciente: 'Toby',
    especie: 'Perro',
    raza: 'Poodle',
    propietario: 'Pedro Sánchez',
  },
];

@Component({
  selector: 'app-citas-hoy',
  standalone: true,
  imports: [
    CommonModule,
    TablaCitasComponent,
    TriajeModalComponent,
    HistorialModalComponent,
    DetallesCitaModalComponent
  ],
  templateUrl: './citas-hoy.component.html',
  styleUrls: ['./citas-hoy.component.css'],
})
export class CitasHoyComponent {
  // Señales para el estado
  searchTerm = signal('');
  citaSeleccionada = signal<any>(null);
  modalTriajeAbierto = signal(false);
  modalHistorialAbierto = signal(false);
  modalDetallesAbierto = signal(false);

  // Computed properties
  citasFiltradas = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return CITAS_HOY;

    return CITAS_HOY.filter(cita =>
      cita.paciente.toLowerCase().includes(term) ||
      cita.propietario.toLowerCase().includes(term)
    );
  });

  pendientes = computed(() =>
    CITAS_HOY.filter(cita => cita.estadoCita === 'PENDIENTE').length
  );

  enTriaje = computed(() =>
    CITAS_HOY.filter(cita => cita.estadoCita === 'TRIAJE').length
  );

  conVeterinario = computed(() =>
    CITAS_HOY.filter(cita => cita.estadoCita === 'CONVETERINARIO').length
  );

  completadas = computed(() =>
    CITAS_HOY.filter(cita => cita.estadoCita === 'COMPLETADA').length
  );

  // Métodos para abrir modales
  abrirModalTriaje(cita: any): void {
    this.citaSeleccionada.set(cita);
    this.modalTriajeAbierto.set(true);
  }

  abrirModalHistorial(cita: any): void {
    this.citaSeleccionada.set(cita);
    this.modalHistorialAbierto.set(true);
  }

  abrirModalDetalles(cita: any): void {
    this.citaSeleccionada.set(cita);
    this.modalDetallesAbierto.set(true);
  }
}
