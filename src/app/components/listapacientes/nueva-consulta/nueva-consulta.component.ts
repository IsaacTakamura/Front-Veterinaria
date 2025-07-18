import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { TipoVisita } from '../../shared/interfaces/historial.model';
import { TipoSignoVital } from '../../shared/interfaces/tipoSignoVital';

@Component({
  selector: 'app-nueva-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-consulta.component.html',
  styleUrls: ['./nueva-consulta.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(20px)', opacity: 0 }))
      ])
    ])
  ]
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
