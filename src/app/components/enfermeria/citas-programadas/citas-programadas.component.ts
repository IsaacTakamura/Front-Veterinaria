// citas-programadas.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TablaCitasComponent } from '../tabla/tabla-citas.component';
import { TriajeModalComponent } from '../triaje/triaje-modal.component';
import { HistorialModalComponent } from '../historial/historial-modal.component';
import { DetallesCitaModalComponent } from '../detalles-cita/detalles-cita-modal.component';
import { CitaService } from '../../../core/services/cita.service';
import { CitaTabla } from '../../shared/interfaces/cita-tabla.model';

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

  citasDelDia = signal<CitaTabla[]>([]);
  fechasConCitas = signal<string[]>([]);

  constructor(private citaService: CitaService) {
    this.cargarFechasConCitas();
    this.cargarCitasDelDia(this.formatDate(this.fechaSeleccionada()));
  }

  // Cargar citas del día seleccionado
  cargarCitasDelDia(fechaStr: string) {
    this.citaService.listarCitasPorFecha(fechaStr).subscribe((resp: any) => {
      this.citasDelDia.set(resp.data as CitaTabla[]);
    });
  }

  // Cargar fechas que tienen citas (puedes optimizar esto con un endpoint que devuelva solo las fechas)
  cargarFechasConCitas() {
    const year = this.fechaActual.getFullYear();
    const month = (this.fechaActual.getMonth() + 1).toString().padStart(2, '0');
    this.citaService.listarCitasPorFecha(`${year}-${month}-01`).subscribe((resp: any) => {
      const fechas = Array.from(new Set(resp.data.map((c: any) => c.fechaRegistro.substring(0, 10)))) as string[];
      this.fechasConCitas.set(fechas);
    });
  }

  // Computed para la tabla
  getCitasDelDia() {
    return this.citasDelDia();
  }

  // Computed para el calendario
  diasDelMes = computed(() => {
    const year = this.fechaActual.getFullYear();
    const month = this.fechaActual.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
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
    return this.fechasConCitas().includes(fechaStr);
  }

  // Verificar si una fecha es la seleccionada
  esFechaSeleccionada(fecha: Date): boolean {
    return fecha.toDateString() === this.fechaSeleccionada().toDateString();
  }

  // Seleccionar una fecha
  seleccionarFecha(fecha: Date): void {
    this.fechaSeleccionada.set(fecha);
    this.cargarCitasDelDia(this.formatDate(fecha));
  }

  // Cambiar de mes
  cambiarMes(delta: number): void {
    this.fechaActual = new Date(
      this.fechaActual.getFullYear(),
      this.fechaActual.getMonth() + delta,
      1
    );
    this.cargarFechasConCitas();
    this.cargarCitasDelDia(this.formatDate(this.fechaSeleccionada()));
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

  // Método para manejar cuando se crea un triaje
  onTriajeCreado(triaje: any): void {
    console.log('Triaje creado:', triaje);
    // Recargar las citas del día para reflejar los cambios
    this.cargarCitasDelDia(this.formatDate(this.fechaSeleccionada()));
  }
}
