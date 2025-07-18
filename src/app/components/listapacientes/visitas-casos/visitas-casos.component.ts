import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  visitasMascota: VisitaExtendida[] = [];
  // Paginación
  paginaActual: number = 1;
  visitasPorPagina: number = 5;

  get totalPaginas(): number {
    return Math.ceil(this.visitasMascota.length / this.visitasPorPagina) || 1;
  }

  get visitasPaginaActual(): VisitaExtendida[] {
    const inicio = (this.paginaActual - 1) * this.visitasPorPagina;
    return this.visitasMascota.slice(inicio, inicio + this.visitasPorPagina);
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  cargandoVisitas: boolean = false;
  casosClinicos: CasoClinico[] = [];
  todasVisitas: Visita[] = [];

  constructor(private historialClinicoService: HistorialClinicoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mascotaId'] && this.mascotaId) {
      this.casosClinicos = [];
      this.visitasMascota = [];
      this.todasVisitas = [];
      this.cargarCatalogos();
    }
  }

  cargarCatalogos() {
    this.cargandoVisitas = true;
    this.historialClinicoService.listarCasosClinicosPorMascotaId(this.mascotaId).subscribe({
      next: (response) => {
        const casos = (response as any)?.data || [];
        this.casosClinicos = casos;
        this.historialClinicoService.listarVisitas().subscribe({
          next: (response2) => {
            this.todasVisitas = (response2 as any)?.data || [];
            this.filtrarVisitasPorMascota();
            this.cargandoVisitas = false;
          },
          error: () => {
            this.todasVisitas = [];
            this.visitasMascota = [];
            this.cargandoVisitas = false;
          }
        });
      },
      error: () => {
        this.casosClinicos = [];
        this.todasVisitas = [];
        this.visitasMascota = [];
        this.cargandoVisitas = false;
      }
    });
  }

  filtrarVisitasPorMascota() {
    // Solo visitas de los casos clínicos de la mascota seleccionada
    const casoIds = this.casosClinicos.map(c => c.casoClinicoId);
    let visitasMascota = this.todasVisitas.filter((v: any) => casoIds.includes(v.casoClinicoId));
    this.visitasMascota = visitasMascota.map((visita: any) => {
      const caso = this.casosClinicos.find(c => c.casoClinicoId === visita.casoClinicoId);
      const tipo = this.tiposVisita.find(t => t.tipoVisitaId === visita.tipoVisitaId);
      return {
        ...visita,
        descripcionCasoClinico: caso?.descripcion || '',
        nombreTipoVisita: tipo?.nombre || ''
      };
    });
  }
}
