import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoVisita, CasoClinico, Visita } from '../../shared/interfaces/historial.model';
import { HistorialClinicoService } from '../../../core/services/historial-clinico.service';

@Component({
  selector: 'app-visitas-casos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas-casos.component.html',
  styleUrls: ['./visitas-casos.component.css']
})
export class VisitasCasosComponent {
  @Input() tiposVisita: TipoVisita[] = [];
  @Input() mascotaId: number = 0;
  @Output() seleccionarTipoVisita = new EventEmitter<TipoVisita>();

  tipoVisitaSeleccionado: TipoVisita | null = null;
  visitasDelTipo: Visita[] = [];
  cargandoVisitas: boolean = false;

  constructor(private historialClinicoService: HistorialClinicoService) {}

  onSeleccionarTipoVisita(tipo: TipoVisita) {
    this.tipoVisitaSeleccionado = tipo;
    this.seleccionarTipoVisita.emit(tipo);
    this.cargarVisitasPorTipo(tipo.tipoVisitaId);
  }

  cargarVisitasPorTipo(tipoVisitaId: number) {
    this.cargandoVisitas = true;
    this.visitasDelTipo = [];

    // Primero cargar todas las visitas de la mascota
    this.historialClinicoService.listarCasosClinicosPorMascotaId(this.mascotaId).subscribe({
      next: (response) => {
        // Manejar tanto si viene como array directo o envuelto en objeto
        const visitas = Array.isArray(response) ? response : (response as any)?.data || [];

        // Filtrar visitas que coincidan con el tipo de visita seleccionado
        this.visitasDelTipo = visitas.filter((visita: any) =>
          visita.tipoVisitaId === tipoVisitaId
        );

        this.cargandoVisitas = false;
      },
      error: () => {
        this.visitasDelTipo = [];
        this.cargandoVisitas = false;
      }
    });
  }
}
