import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoVisita, CasoClinico, Visita } from '../../shared/interfaces/historial.model';

@Component({
  selector: 'app-visitas-casos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas-casos.component.html',
  styleUrls: ['./visitas-casos.component.css']
})
export class VisitasCasosComponent {
  @Input() tiposVisita: TipoVisita[] = [];
  @Input() casosClinicos: CasoClinico[] = [];
  @Input() historialVisitas: Visita[] = [];
  @Input() tipoVisitaSeleccionado: TipoVisita | null = null;
  @Output() seleccionarTipoVisita = new EventEmitter<TipoVisita>();

  casoRelacionadoConTipoVisita(caso: CasoClinico, tipo: TipoVisita | null): boolean {
    if (!tipo) return false;
    return this.historialVisitas.some(v => v.casoClinicoId === caso.casoClinicoId && v.tipoVisitaId === tipo.tipoVisitaId);
  }

  onSeleccionarTipoVisita(tipo: TipoVisita) {
    this.seleccionarTipoVisita.emit(tipo);
  }
}
