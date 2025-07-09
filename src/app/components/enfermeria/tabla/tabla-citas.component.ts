import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgClass, NgIf, NgFor } from '@angular/common';
import { Cita } from '../../shared/interfaces/cita.model';
import { EstadoCitaColorPipe } from '../../shared/pipes/estado-cita-color.pipe';
import { CitaTabla } from '../../shared/interfaces/CitaTabla.model';

@Component({
  selector: 'app-tabla-citas',
  templateUrl: './tabla-citas.component.html',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, NgFor, EstadoCitaColorPipe]
})
export class TablaCitasComponent {
  @Input() citas: CitaTabla[] = [];
  @Output() seleccionarCita = new EventEmitter<Cita>();

  emitirSeleccion(cita: Cita) {
    this.seleccionarCita.emit(cita);
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
