import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoVisita } from '../../shared/interfaces/historial.model';
import { TipoSignoVital } from '../../shared/interfaces/tipoSignoVital';
import { Cita } from '../../shared/interfaces/cita.model';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-nueva-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-consulta.component.html',
  styleUrls: ['./nueva-consulta.component.css']
})
export class NuevaConsultaComponent {
  @Input() tiposVisita: TipoVisita[] = [];
  @Input() tipoVisitaSeleccionado: TipoVisita | null = null;
  @Input() descripcion: string = '';
  @Input() tiposSignoVital: TipoSignoVital[] = [];
  @Input() cita: Cita | null = null; // Agregamos input para la cita
  @Output() registrarConsulta = new EventEmitter<void>();
  @Output() tipoVisitaChange = new EventEmitter<TipoVisita | null>();
  @Output() descripcionChange = new EventEmitter<string>();
  @Output() signosVitalesChange = new EventEmitter<any[]>();
  @Output() nuevoTipoSignoVital = new EventEmitter<string>();
  @Output() citaCompletada = new EventEmitter<Cita>(); // Output para cuando se complete la cita

  // Signos vitales
  signoVitalSeleccionado: TipoSignoVital | null = null;
  valorSignoVital: string = '';
  mostrarNuevoTipo: boolean = false;
  nombreNuevoTipo: string = '';
  signosVitales: { tipo: TipoSignoVital, valor: string }[] = [];

  constructor(private citaService: CitaService) {}

  onTipoVisitaChange(tipo: TipoVisita | null) {
    this.tipoVisitaChange.emit(tipo);
  }

  onDescripcionChange(descripcion: string) {
    this.descripcionChange.emit(descripcion);
  }

      onRegistrarConsulta() {
    console.log('🔄 Iniciando registro de consulta...');
    console.log('📋 Cita actual:', this.cita);

    // Primero emitir el evento de registrar consulta
    this.registrarConsulta.emit();

    // Esperar un momento para que se registre la consulta antes de cambiar el estado
    setTimeout(() => {
      this.cambiarEstadoCitaACompletada();
    }, 1000);
  }

    // Cambiar estado de la cita a COMPLETADA
  cambiarEstadoCitaACompletada() {
    if (!this.cita || !this.cita.citaId) {
      console.warn('⚠️ No hay cita válida para cambiar estado a COMPLETADA');
      console.warn('Cita recibida:', this.cita);
      return;
    }

    console.log('🔄 Cambiando estado de cita a COMPLETADA:', this.cita.citaId);
    console.log('📞 Llamando endpoint:', `/api/v1/vet/estadoCita/${this.cita.citaId}/COMPLETADA`);

    this.citaService.cambiarEstadoCitaVeterinario(this.cita.citaId, 'COMPLETADA')
      .subscribe({
        next: (citaActualizada) => {
          console.log('✅ Cita marcada como COMPLETADA exitosamente:', citaActualizada);
          this.citaCompletada.emit(citaActualizada);
        },
        error: (error) => {
          console.error('❌ Error al cambiar estado de cita a COMPLETADA:', error);
          console.error('Detalles del error:', error);
        }
      });
  }

  agregarSignoVital() {
    if (this.signoVitalSeleccionado && this.valorSignoVital) {
      this.signosVitales.push({ tipo: this.signoVitalSeleccionado, valor: this.valorSignoVital });
      this.signosVitalesChange.emit(this.signosVitales);
      this.signoVitalSeleccionado = null;
      this.valorSignoVital = '';
    }
  }

  eliminarSignoVital(idx: number) {
    this.signosVitales.splice(idx, 1);
    this.signosVitalesChange.emit(this.signosVitales);
  }

  mostrarInputNuevoTipo() {
    this.mostrarNuevoTipo = true;
    this.nombreNuevoTipo = '';
  }

  crearNuevoTipo() {
    console.log('🔄 Creando nuevo tipo de signo vital desde componente:', this.nombreNuevoTipo);

    if (this.nombreNuevoTipo.trim()) {
      const nombreLimpio = this.nombreNuevoTipo.trim();
      console.log('📤 Emitiendo evento con nombre:', nombreLimpio);
      this.nuevoTipoSignoVital.emit(nombreLimpio);
      this.mostrarNuevoTipo = false;
      this.nombreNuevoTipo = '';
    } else {
      console.warn('⚠️ Nombre de tipo de signo vital vacío o solo espacios');
    }
  }
}
