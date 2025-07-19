// historial-modal.component.ts
import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialClinicoService } from '../../../core/services/historial-clinico.service';
import { CasoClinico, Visita } from '../../shared/interfaces/historial.model';

@Component({
  selector: 'app-historial-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-modal.component.html',
  styleUrls: ['./historial-modal.component.css'],
})
export class HistorialModalComponent implements OnInit {
  // Señales para el estado del componente
  isOpen = signal(false);
  cita = signal<any>(null);
  cargando = signal(false);

  // Datos del historial
  casosClinicos = signal<CasoClinico[]>([]);
  visitas = signal<Visita[]>([]);

  // Actualizadores de inputs mediante setters
  @Input() set isOpenValue(value: boolean) {
    this.isOpen.set(value);
    if (value && this.cita()) {
      this.cargarHistorial();
    }
  }
  @Input() set citaData(value: any) {
    this.cita.set(value);
  }

  // Evento de salida para cerrar el modal
  @Output() onClose = new EventEmitter<void>();

  constructor(private historialService: HistorialClinicoService) {}

  ngOnInit() {
    // El historial se cargará cuando se abra el modal
  }

  // Cargar historial de la mascota
  cargarHistorial() {
    if (!this.cita()?.mascotaId) return;

    this.cargando.set(true);

    // Obtener casos clínicos de la mascota
    this.historialService.listarHistorialPorMascotaid(this.cita().mascotaId).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.casosClinicos.set(response.data);
          // Aquí podrías cargar también las visitas si es necesario
          this.cargando.set(false);
        }
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
        this.cargando.set(false);
      }
    });
  }

  // Cerrar modal al hacer clic en el fondo
  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose.emit();
    }
  }

  // Obtener el nombre del tipo de visita
  getTipoVisitaNombre(tipoVisitaId: number): string {
    switch (tipoVisitaId) {
      case 1: return 'Vacunación';
      case 2: return 'Diagnóstico';
      case 3: return 'Seguimiento';
      default: return 'Consulta';
    }
  }

  // Formatear fecha
  formatearFecha(fecha: string): string {
    if (!fecha) return 'Fecha no disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
