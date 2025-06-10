// detalles-cita-modal.component.ts
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalles-cita-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles-cita-modal.component.html',
  styleUrls: ['./detalles-cita-modal.component.css'],
})
export class DetallesCitaModalComponent {
  // Señales para el estado del componente
  isOpen = signal(false);
  cita = signal<any>(null);

  // Actualizadores de inputs mediante setters
  @Input() set isOpenValue(value: boolean) {
    this.isOpen.set(value);
  }

  @Input() set citaData(value: any) {
    this.cita.set(value);
  }

  // Evento de salida para cerrar el modal
  @Output() onClose = new EventEmitter<void>();

  // Función para obtener el color de la badge según el estado
  getBadgeColor(estado: string): string {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "en-triaje":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "con-veterinario":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      case "completada":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  }

  // Función para obtener el texto del estado
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "en-triaje":
        return "En Triaje";
      case "con-veterinario":
        return "Con Veterinario";
      case "completada":
        return "Completada";
      default:
        return estado;
    }
  }

  // Cerrar modal al hacer clic en el fondo
  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('bg-black')) {
      this.onClose.emit();
    }
  }
}
