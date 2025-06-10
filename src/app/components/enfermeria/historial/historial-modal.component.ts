// historial-modal.component.ts
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-modal.component.html',
  styleUrls: ['./historial-modal.component.css'],
})
export class HistorialModalComponent {
  // Señales para el estado del componente
  isOpen = signal(false);
  activeTab = signal<'consultas' | 'vacunas'>('consultas');
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

  // Datos de ejemplo
  historialEjemplo = [
    {
      fecha: "15/04/2025",
      motivo: "Vacunación",
      veterinario: "Dr. Martínez",
      signos: {
        temperatura: "38.5°C",
        frecuenciaCardiaca: "120 lpm",
        frecuenciaRespiratoria: "22 rpm",
        peso: "5.2 kg",
      },
      diagnostico: "Paciente sano",
      tratamiento: "Vacuna antirrábica",
      observaciones: "Reacción normal a la vacuna. Próxima vacuna en un año.",
    },
    {
      fecha: "10/01/2025",
      motivo: "Control",
      veterinario: "Dra. Gómez",
      signos: {
        temperatura: "38.7°C",
        frecuenciaCardiaca: "125 lpm",
        frecuenciaRespiratoria: "24 rpm",
        peso: "5.0 kg",
      },
      diagnostico: "Paciente sano",
      tratamiento: "Desparasitación interna",
      observaciones: "Se recomienda control en 3 meses.",
    },
    {
      fecha: "05/10/2024",
      motivo: "Consulta por vómitos",
      veterinario: "Dr. Martínez",
      signos: {
        temperatura: "39.1°C",
        frecuenciaCardiaca: "130 lpm",
        frecuenciaRespiratoria: "26 rpm",
        peso: "4.8 kg",
      },
      diagnostico: "Gastroenteritis leve",
      tratamiento: "Metoclopramida 0.5ml/12h por 3 días, dieta blanda",
      observaciones: "Mejoría en 48 horas. Control si persisten los síntomas.",
    },
  ];

  vacunasEjemplo = [
    {
      fecha: "15/04/2025",
      tipo: "Antirrábica",
      lote: "RAB-2025-456",
      proxima: "15/04/2026",
    },
    {
      fecha: "15/03/2025",
      tipo: "Parvovirus",
      lote: "PAR-2025-123",
      proxima: "15/03/2026",
    },
    {
      fecha: "15/02/2025",
      tipo: "Moquillo",
      lote: "MOQ-2025-789",
      proxima: "15/02/2026",
    },
  ];

  // Cerrar modal al hacer clic en el fondo
  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('bg-black')) {
      this.onClose.emit();
    }
  }
}
