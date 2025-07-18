import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { TipoVisita, CasoClinico, Visita } from '../../shared/interfaces/historial.model';
import { HistorialClinicoService } from '../../../core/services/historial-clinico.service';

interface VisitaExtendida extends Visita {
  nombreTipoVisita?: string;
  descripcionCasoClinico?: string;
}

@Component({
  selector: 'app-visitas-casos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visitas-casos.component.html',
  styleUrls: ['./visitas-casos.component.css']
})
export class VisitasCasosComponent implements OnChanges {
  @Input() tiposVisita: TipoVisita[] = [];
  @Input() mascotaId: number = 0;
  @Output() seleccionarTipoVisita = new EventEmitter<TipoVisita>();

  tipoVisitaSeleccionado: TipoVisita | null = null;
  visitasDelTipo: VisitaExtendida[] = [];
  cargandoVisitas: boolean = false;
  casosClinicos: CasoClinico[] = [];

  constructor(private historialClinicoService: HistorialClinicoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mascotaId'] && this.mascotaId) {
      this.casosClinicos = [];
      this.tipoVisitaSeleccionado = null;
      this.visitasDelTipo = [];
      this.cargarCasosClinicos();
    }
  }

  onSeleccionarTipoVisita(tipo: TipoVisita) {
    this.tipoVisitaSeleccionado = tipo;
    this.seleccionarTipoVisita.emit(tipo);
    this.cargarVisitasPorTipo(tipo.tipoVisitaId);
  }

  cargarCasosClinicos() {
    this.historialClinicoService.listarCasosClinicosPorMascotaId(this.mascotaId).subscribe({
      next: (response) => {
        const casos = Array.isArray(response) ? response : (response as any)?.data || [];
        this.casosClinicos = casos;
      },
      error: () => {
        this.casosClinicos = [];
      }
    });
  }

  cargarVisitasPorTipo(tipoVisitaId: number) {
    this.cargandoVisitas = true;
    this.visitasDelTipo = [];
    this.historialClinicoService.listarVisitas().subscribe({
      next: (response) => {
        const visitas = Array.isArray(response) ? response : (response as any)?.data || [];
        const casoIds = this.casosClinicos.map(c => c.casoClinicoId);
        const visitasFiltradas = visitas.filter((visita: any) =>
          casoIds.includes(visita.casoClinicoId) && visita.tipoVisitaId === tipoVisitaId
        );
        // Llamadas paralelas para enriquecer cada visita
        const llamadas = visitasFiltradas.map((visita: any) =>
          forkJoin({
            tipo: this.historialClinicoService.listarTipoVisitaPorId(visita.tipoVisitaId),
            caso: this.historialClinicoService.listarCasoClinicoPorId(visita.casoClinicoId)
          })
        );
        if (llamadas.length === 0) {
          this.visitasDelTipo = [];
          this.cargandoVisitas = false;
          return;
        }
        forkJoin(llamadas).subscribe(
          (resultados => {
            const res: any[] = resultados as any[];
            this.visitasDelTipo = visitasFiltradas.map((visita: any, i: number) => {
              const tipo = res[i].tipo?.data?.nombre || '';
              const caso = res[i].caso?.data?.descripcion || '';
              return {
                ...visita,
                nombreTipoVisita: tipo,
                descripcionCasoClinico: caso
              };
            });
            this.cargandoVisitas = false;
          }),
          () => {
            this.visitasDelTipo = [];
            this.cargandoVisitas = false;
          }
        );
      },
      error: () => {
        this.visitasDelTipo = [];
        this.cargandoVisitas = false;
      }
    });
  }
}
