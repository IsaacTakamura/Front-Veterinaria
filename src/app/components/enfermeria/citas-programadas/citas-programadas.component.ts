// citas-programadas.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TablaCitasComponent } from '../tabla/tabla-citas.component';
import { TriajeModalComponent } from '../triaje/triaje-modal.component';
import { HistorialModalComponent } from '../historial/historial-modal.component';
import { DetallesCitaModalComponent } from '../detalles-cita/detalles-cita-modal.component';

// Datos de ejemplo para las citas programadas
const CITAS_PROGRAMADAS: Record<string, any[]> = {
  "2025-05-23": [
    {
      id: "6",
      hora: "09:00",
      paciente: "Pelusa",
      especie: "Perro",
      raza: "Pomerania",
      edad: "2 años",
      propietario: "Laura Jiménez",
      telefono: "987654321",
      motivo: "Vacunación",
      estado: "pendiente",
    },
    {
      id: "7",
      hora: "10:30",
      paciente: "Simba",
      especie: "Gato",
      raza: "Angora",
      edad: "3 años",
      propietario: "Roberto Díaz",
      telefono: "912345678",
      motivo: "Control",
      estado: "pendiente",
    },
  ],
  "2025-05-24": [
    {
      id: "8",
      hora: "11:00",
      paciente: "Lola",
      especie: "Perro",
      raza: "Beagle",
      edad: "4 años",
      propietario: "Carmen Ruiz",
      telefono: "945678123",
      motivo: "Consulta general",
      estado: "pendiente",
    },
  ],
  "2025-05-25": [
    {
      id: "9",
      hora: "09:30",
      paciente: "Nala",
      especie: "Gato",
      raza: "Común europeo",
      edad: "1 año",
      propietario: "Miguel Torres",
      telefono: "978123456",
      motivo: "Desparasitación",
      estado: "pendiente",
    },
    {
      id: "10",
      hora: "12:00",
      paciente: "Rex",
      especie: "Perro",
      raza: "Pastor Alemán",
      edad: "5 años",
      propietario: "Sofía Morales",
      telefono: "987123456",
      motivo: "Vacunación",
      estado: "pendiente",
    },
  ],
};

@Component({
  selector: 'app-citas-programadas',
  standalone: true,
  imports: [
    CommonModule,
    TablaCitasComponent,
    TriajeModalComponent,
    HistorialModalComponent,
    DetallesCitaModalComponent
  ],
  providers: [DatePipe],
  templateUrl: './citas-programadas.component.html',
  styleUrls: ['./citas-programadas.component.css'],
})
export class CitasProgramadasComponent {
  // Señales para el estado
  fechaActual = new Date();
  fechaSeleccionada = signal<Date>(new Date());
  citaSeleccionada = signal<any>(null);
  modalTriajeAbierto = signal(false);
  modalHistorialAbierto = signal(false);
  modalDetallesAbierto = signal(false);

  // Computed properties
  citasDelDia = computed(() => {
    const fechaStr = this.formatDate(this.fechaSeleccionada());
    return CITAS_PROGRAMADAS[fechaStr] || [];
  });

  diasDelMes = computed(() => {
    const year = this.fechaActual.getFullYear();
    const month = this.fechaActual.getMonth();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);

    // Días del mes anterior para completar la primera semana
    const days: (Date | null)[] = [];
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    // Agregar días vacíos para alinear el primer día
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Agregar todos los días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  });

  // Formatear fecha a YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Verificar si una fecha tiene citas
  tieneCitas(fecha: Date | null): boolean {
    if (!fecha) return false;
    const fechaStr = this.formatDate(fecha);
    return !!CITAS_PROGRAMADAS[fechaStr]?.length;
  }

  // Verificar si una fecha es la seleccionada
  esFechaSeleccionada(fecha: Date): boolean {
    return fecha.toDateString() === this.fechaSeleccionada().toDateString();
  }

  // Seleccionar una fecha
  seleccionarFecha(fecha: Date): void {
    this.fechaSeleccionada.set(fecha);
  }

  // Cambiar de mes
  cambiarMes(delta: number): void {
    this.fechaActual = new Date(
      this.fechaActual.getFullYear(),
      this.fechaActual.getMonth() + delta,
      1
    );
  }

  // Abrir modales
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
