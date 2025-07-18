import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoVisita } from '../../shared/interfaces/historial.model';
import { TipoSignoVital } from '../../shared/interfaces/tipoSignoVital';

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
  @Output() registrarConsulta = new EventEmitter<void>();
  @Output() tipoVisitaChange = new EventEmitter<TipoVisita | null>();
  @Output() descripcionChange = new EventEmitter<string>();
  @Output() signosVitalesChange = new EventEmitter<any[]>();
  @Output() nuevoTipoSignoVital = new EventEmitter<string>();

  // Signos vitales
  signoVitalSeleccionado: TipoSignoVital | null = null;
  valorSignoVital: string = '';
  mostrarNuevoTipo: boolean = false;
  nombreNuevoTipo: string = '';
  signosVitales: { tipo: TipoSignoVital, valor: string }[] = [];

  onTipoVisitaChange(tipo: TipoVisita | null) {
    this.tipoVisitaChange.emit(tipo);
  }

  onDescripcionChange(descripcion: string) {
    this.descripcionChange.emit(descripcion);
  }

  onRegistrarConsulta() {
    this.registrarConsulta.emit();
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
    if (this.nombreNuevoTipo.trim()) {
      this.nuevoTipoSignoVital.emit(this.nombreNuevoTipo.trim());
      this.mostrarNuevoTipo = false;
      this.nombreNuevoTipo = '';
    }
  }
}
