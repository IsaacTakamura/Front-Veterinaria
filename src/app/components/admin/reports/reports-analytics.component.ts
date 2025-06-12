import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type ReporteKeys = 'atencion-diaria' | 'reprogramaciones' | 'facturacion';

type AtencionDiariaData = { fecha: string; consultas: number; emergencias: number; cirugias: number; };
type ReprogramacionesData = { mes: string; total: number; reprogramadas: number; porcentaje: string; };
type FacturacionData = { servicio: string; cantidad: number; total: number; };

type ReporteData =
  | { titulo: string; datos: AtencionDiariaData[] }
  | { titulo: string; datos: ReprogramacionesData[] }
  | { titulo: string; datos: FacturacionData[] };


@Component({
  selector: 'app-reports-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-analytics.component.html',
  styleUrls: ['./reports-analytics.component.css']
})
export class ReportsAnalyticsComponent {
  @Input() activeTab!: string;

  reportes = {
    'atencion-diaria': {
      titulo: 'Reporte de Atención Diaria',
      datos: [
        { fecha: '2024-01-15', consultas: 12, emergencias: 2, cirugias: 1 },
        { fecha: '2024-01-16', consultas: 15, emergencias: 1, cirugias: 3 },
        { fecha: '2024-01-17', consultas: 8, emergencias: 0, cirugias: 2 }
      ]
    },
    reprogramaciones: {
      titulo: 'Índice de Reprogramaciones',
      datos: [
        { mes: 'Enero', total: 45, reprogramadas: 8, porcentaje: '17.8%' },
        { mes: 'Febrero', total: 52, reprogramadas: 6, porcentaje: '11.5%' }
      ]
    },
    facturacion: {
      titulo: 'Reporte de Facturación',
      datos: [
        { servicio: 'Consulta General', cantidad: 25, total: 1250 },
        { servicio: 'Vacunación', cantidad: 18, total: 630 },
        { servicio: 'Cirugía', cantidad: 5, total: 1000 }
      ]
    }
  };

  get facturacionResumen() {
    const fact = this.reportes['facturacion'].datos;
    const total = fact.reduce((sum, f) => sum + f.total, 0);
    const cantidad = fact.reduce((sum, f) => sum + f.cantidad, 0);
    const promedio = cantidad > 0 ? Math.round(total / cantidad) : 0;
    return {
      total,
      cantidad,
      promedio
    };
  }
  getReporteData(tab: string) {
    // Aquí puedes validar si el tab existe o devolver uno por defecto
    return this.reportes[tab as ReporteKeys];
  }
  // Agrega estos métodos
  getAtencionDiariaDatos() {
    return (this.reportes['atencion-diaria'].datos as { fecha: string; consultas: number; emergencias: number; cirugias: number; }[]);
  }

  getFacturacionDatos() {
    return (this.reportes['facturacion'].datos as { servicio: string; cantidad: number; total: number; }[]);
  }

  getReprogramacionesDatos() {
    return (this.reportes['reprogramaciones'].datos as { mes: string; total: number; reprogramadas: number; porcentaje: string; }[]);
  }


}
