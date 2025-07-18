import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoVisita } from '../../shared/interfaces/historial.model';

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
  @Output() registrarConsulta = new EventEmitter<void>();
  @Output() tipoVisitaChange = new EventEmitter<TipoVisita | null>();
  @Output() descripcionChange = new EventEmitter<string>();

  onTipoVisitaChange(tipo: TipoVisita | null) {
    this.tipoVisitaChange.emit(tipo);
  }

  onDescripcionChange(descripcion: string) {
    this.descripcionChange.emit(descripcion);
  }

  onRegistrarConsulta() {
    this.registrarConsulta.emit();
  }
}
