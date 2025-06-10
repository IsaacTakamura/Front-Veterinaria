import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-citas',
  templateUrl: './tabla-citas.component.html',
  styleUrls: ['./tabla-citas.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class TablaCitasComponent {
  @Input() citas: any[] = [];
  @Output() onTriaje = new EventEmitter<any>();
  @Output() onHistorial = new EventEmitter<any>();
  @Output() onDetalles = new EventEmitter<any>();

  getBadgeColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'en-triaje':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'con-veterinario':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'completada':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return '';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
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
