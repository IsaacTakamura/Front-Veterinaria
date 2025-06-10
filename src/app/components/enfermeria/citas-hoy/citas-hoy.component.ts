// citas-hoy.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaCitasComponent } from '../tabla/tabla-citas.component';
import { TriajeModalComponent } from '../triaje/triaje-modal.component';
import { HistorialModalComponent } from '../historial/historial-modal.component';
import { DetallesCitaModalComponent } from '../detalles-cita/detalles-cita-modal.component';

// Datos de ejemplo para las citas de hoy
const CITAS_HOY = [
  {
    id: "1",
    hora: "09:00",
    paciente: "Max",
    especie: "Perro",
    raza: "Labrador",
    edad: "3 años",
    propietario: "Juan Pérez",
    telefono: "987654321",
    motivo: "Vacunación",
    estado: "pendiente",
  },
  {
    id: "2",
    hora: "09:30",
    paciente: "Luna",
    especie: "Gato",
    raza: "Siamés",
    edad: "2 años",
    propietario: "María García",
    telefono: "987123456",
    motivo: "Control",
    estado: "en-triaje",
  },
  {
    id: "3",
    hora: "10:00",
    paciente: "Rocky",
    especie: "Perro",
    raza: "Bulldog",
    edad: "5 años",
    propietario: "Carlos López",
    telefono: "912345678",
    motivo: "Consulta general",
    estado: "con-veterinario",
  },
  {
    id: "4",
    hora: "10:30",
    paciente: "Michi",
    especie: "Gato",
    raza: "Persa",
    edad: "1 año",
    propietario: "Ana Martínez",
    telefono: "945678123",
    motivo: "Desparasitación",
    estado: "completada",
  },
  {
    id: "5",
    hora: "11:00",
    paciente: "Toby",
    especie: "Perro",
    raza: "Poodle",
    edad: "4 años",
    propietario: "Pedro Sánchez",
    telefono: "978123456",
    motivo: "Vacunación",
    estado: "pendiente",
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
    CITAS_HOY.filter(cita => cita.estado === "pendiente").length
  );

  enTriaje = computed(() =>
    CITAS_HOY.filter(cita => cita.estado === "en-triaje").length
  );

  conVeterinario = computed(() =>
    CITAS_HOY.filter(cita => cita.estado === "con-veterinario").length
  );

  completadas = computed(() =>
    CITAS_HOY.filter(cita => cita.estado === "completada").length
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
