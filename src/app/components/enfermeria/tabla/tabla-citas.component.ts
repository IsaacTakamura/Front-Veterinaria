import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgClass, NgIf, NgFor } from '@angular/common';
import { EstadoCitaColorPipe } from '../../shared/pipes/estado-cita-color.pipe';
import { CitaTabla } from '../../shared/interfaces/cita-tabla.model';
import { IconStethoscopeComponent } from '../../icons/icon-stethoscope.component';

@Component({
  selector: 'app-tabla-citas',
  templateUrl: './tabla-citas.component.html',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, NgFor, EstadoCitaColorPipe, IconStethoscopeComponent]
})
export class TablaCitasComponent {
  @Input() citas: CitaTabla[] = [];
  @Output() onTriaje = new EventEmitter<CitaTabla>();
  @Output() onHistorial = new EventEmitter<CitaTabla>();
  @Output() onDetalles = new EventEmitter<CitaTabla>();

  emitirTriaje(cita: CitaTabla) {
    this.onTriaje.emit(cita);
  }
  emitirHistorial(cita: CitaTabla) {
    this.onHistorial.emit(cita);
  }
  emitirDetalles(cita: CitaTabla) {
    this.onDetalles.emit(cita);
  }

  getEstadoTexto(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'en-triaje':
        return 'En Triaje';
      case 'con-veterinario':
        return 'Con Veterinario';
      case 'completada':
        return 'Completada';
      default:
        return estado;
    }
  }
}
