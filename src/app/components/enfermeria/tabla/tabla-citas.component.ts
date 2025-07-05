import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-tabla-citas',
  templateUrl: './tabla-citas.component.html',
  styleUrls: ['./tabla-citas.component.css'],
  imports: [CommonModule],
  standalone: true
})

export class TablaCitasComponent implements OnInit {
  @Input() citas: any[] | null = null;
  @Output() onTriaje = new EventEmitter<any>();
  @Output() onHistorial = new EventEmitter<any>();
  @Output() onDetalles = new EventEmitter<any>();

  allCitas: any[] = [];

  constructor(private citaService: CitaService) { }

  ngOnInit(): void {
    if (this.citas === null) {
      this.citaService.listarCitas().subscribe(data => {
        this.allCitas = data;
      });
    }
  }

  get citasToShow(): any[] {
    return this.citas !== null ? this.citas : this.allCitas;
  }

  getBadgeColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'en-triaje':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'con-veterinario':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'completada':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return '';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en-triaje':
        return 'En Triaje';
      case 'con-veterinario':
        return 'Con Veterinario';
      case 'completada':
        return 'Completada';
      default:
        return estado;
    }
  }

  trackByCitaId(index: number, cita: any): any {
    return cita.citaId || cita.id || index;
  }
}
