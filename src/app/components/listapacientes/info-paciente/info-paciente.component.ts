import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../shared/interfaces/cliente.model';
import { Cita } from '../../shared/interfaces/cita.model';
import { CitaService } from '../../../core/services/cita.service';

export interface PacienteInfo {
  nombreMascota: string;
  edad: number;
  raza: string;
  especie: string;
  propietario: string;
  mascotaId?: number; // Agregamos el ID de la mascota
}

@Component({
  selector: 'app-info-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-paciente.component.html',
  styleUrls: ['./info-paciente.component.css']
})
export class InfoPacienteComponent implements OnInit, OnChanges {
  @Input() paciente: PacienteInfo | null = null;
  @Input() propietario: Cliente | null = null;
  @Input() cita: Cita | null = null;
  @Output() estadoCambiado = new EventEmitter<Cita>();

  citaEncontrada: Cita | null = null;
  cargandoCita: boolean = false;

  constructor(private citaService: CitaService) {}

  ngOnInit() {
    // Si no hay cita pasada como input, buscar automáticamente
    if (!this.cita && this.paciente?.mascotaId) {
      this.buscarCitaDeHoy();
    } else {
      this.citaEncontrada = this.cita;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detectar cambios en el paciente
    if (changes['paciente'] && changes['paciente'].currentValue) {
      const pacienteActual = changes['paciente'].currentValue;
      const pacienteAnterior = changes['paciente'].previousValue;

      // Si cambió el mascotaId, buscar la nueva cita
      if (pacienteActual?.mascotaId !== pacienteAnterior?.mascotaId) {
        console.log('Cambió la mascota, buscando nueva cita...');
        this.citaEncontrada = null; // Limpiar cita anterior
        if (pacienteActual?.mascotaId) {
          this.buscarCitaDeHoy();
        }
      }
    }
  }

  // Buscar la cita de hoy para esta mascota
  buscarCitaDeHoy() {
    if (!this.paciente?.mascotaId) return;

    this.cargandoCita = true;
    this.citaService.listarCitasHoyVeterinario()
      .subscribe({
        next: (citas) => {
          console.log('Citas de hoy:', citas);
          // Buscar la cita que corresponda a esta mascota
          const citaEncontrada = citas.find(cita => cita.mascotaId === this.paciente?.mascotaId);

          // Validar que la cita tenga estadoCita
          if (citaEncontrada && citaEncontrada.estadoCita) {
            this.citaEncontrada = citaEncontrada;
            console.log('Cita encontrada para mascota:', this.citaEncontrada);
          } else {
            this.citaEncontrada = null;
            console.warn('Cita encontrada pero sin estadoCita válido:', citaEncontrada);
          }

          this.cargandoCita = false;
        },
        error: (error) => {
          console.error('Error al buscar citas de hoy:', error);
          this.cargandoCita = false;
        }
      });
  }

  // Verificar si se puede cambiar el estado a CONVETERINARIO
  puedeCambiarAConVeterinario(): boolean {
    const citaActual = this.citaEncontrada || this.cita;
    if (!citaActual) return false;
    return citaActual.estadoCita === 'PENDIENTE' || citaActual.estadoCita === 'TRIAJE';
  }

  // Cambiar estado a CONVETERINARIO
  cambiarEstadoAConVeterinario() {
    const citaActual = this.citaEncontrada || this.cita;
    if (!citaActual || !citaActual.citaId) {
      console.error('No hay cita válida para cambiar estado');
      return;
    }

    this.citaService.cambiarEstadoCitaVeterinario(citaActual.citaId, 'CONVETERINARIO')
      .subscribe({
        next: (citaActualizada) => {
          console.log('Estado cambiado exitosamente:', citaActualizada);
          this.citaEncontrada = citaActualizada;
          this.estadoCambiado.emit(citaActualizada);
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
        }
      });
  }

  // Obtener el texto del botón según el estado
  getTextoBoton(): string {
    const citaActual = this.citaEncontrada || this.cita;
    if (!citaActual) return 'Sin cita';

    switch (citaActual.estadoCita) {
      case 'PENDIENTE':
      case 'TRIAJE':
        return 'Enviar al Veterinario';
      case 'CONVETERINARIO':
        return 'Enviado al Veterinario';
      case 'COMPLETADA':
        return 'Consulta Completada';
      default:
        return 'Estado Desconocido';
    }
  }

  // Obtener la clase CSS del botón según el estado
  getClaseBoton(): string {
    const citaActual = this.citaEncontrada || this.cita;
    if (!citaActual) return 'btn-disabled';

    switch (citaActual.estadoCita) {
      case 'PENDIENTE':
      case 'TRIAJE':
        return 'btn-send-vet';
      case 'CONVETERINARIO':
        return 'btn-sent-vet';
      case 'COMPLETADA':
        return 'btn-completed';
      default:
        return 'btn-disabled';
    }
  }

  // Obtener la cita actual para mostrar en el template
  getCitaActual(): Cita | null {
    const cita = this.citaEncontrada || this.cita;
    // Verificar que la cita tenga estadoCita definido
    if (cita && !cita.estadoCita) {
      console.warn('Cita encontrada pero sin estadoCita:', cita);
      return null;
    }
    return cita;
  }
}
