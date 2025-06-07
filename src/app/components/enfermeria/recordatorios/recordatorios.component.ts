import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
interface RecordatorioPendiente {
  id: string;
  paciente: string;
  propietario: string;
  telefono: string;
  tipo: string;
  descripcion: string;
  fechaVencimiento: string;
  diasRestantes: number;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'enviado';
  ultimoEnvio: string | null;
}

interface RecordatorioProgramado {
  id: string;
  paciente: string;
  propietario: string;
  telefono: string;
  tipo: string;
  descripcion: string;
  fechaProgramada: string;
  estado: 'programado';
}

@Component({
  selector: 'app-recordatorios',
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RecordatoriosComponent {
  searchTerm = signal('');
  modalAbierto = signal(false);
  recordatorioSeleccionado = signal<RecordatorioPendiente | null>(null);

  recordatorios = signal<RecordatorioPendiente[]>([
    // Aquí pega los datos de recordatoriosPendientes
  ]);

  recordatoriosProgramados = signal<RecordatorioProgramado[]>([
    // Aquí pega los datos de recordatoriosProgramados
  ]);

  // --- Computed signals ---
  recordatoriosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.recordatorios().filter(r =>
      r.paciente.toLowerCase().includes(term) || r.propietario.toLowerCase().includes(term)
    );
  });

  urgentes = computed(() =>
    this.recordatorios().filter(r => r.diasRestantes <= 3 && r.estado === 'pendiente').length
  );

  proximosVencer = computed(() =>
    this.recordatorios().filter(r => r.diasRestantes <= 7 && r.estado === 'pendiente').length
  );

  enviados = computed(() =>
    this.recordatorios().filter(r => r.estado === 'enviado').length
  );

  totalPendientes = computed(() =>
    this.recordatorios().filter(r => r.estado === 'pendiente').length
  );

  abrirModal(recordatorio: RecordatorioPendiente) {
    this.recordatorioSeleccionado.set(recordatorio);
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  enviarRecordatorio(id: string, metodo: string) {
    const actualizados = this.recordatorios().map(r => {
      if (r.id === id) {
        return {
          ...r,
          estado: 'enviado' as 'enviado',
          ultimoEnvio: new Date().toISOString().split('T')[0] as string | null,
        } as RecordatorioPendiente;
      }
      return r;
    });
    this.recordatorios.set(actualizados);
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'vacuna': return '💉';
      case 'control': return '🩺';
      case 'desparasitacion': return '💊';
      default: return '📋';
    }
  }

  getPrioridadColor(prioridad: string): string {
    switch (prioridad) {
      case 'alta': return 'bg-red-500 hover:bg-red-600';
      case 'media': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'baja': return 'bg-green-500 hover:bg-green-600';
      default: return '';
    }
  }
}
