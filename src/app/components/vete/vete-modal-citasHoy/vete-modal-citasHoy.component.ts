import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita } from '../../shared/interfaces/cita.model';

@Component({
  selector: 'app-vete-modal-citas-hoy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Todas las Citas de Hoy</h2>
          <button class="close-btn" (click)="onClose()">&times;</button>
        </div>
        <div class="modal-body">
          <table class="citas-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Mascota</th>
                <th>Cliente</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cita of citas">
                <td>{{ cita.fechaRegistro | date:'shortTime' }}</td>
                <td>{{ cita.mascotaId }}</td>
                <td>{{ cita.clienteId }}</td>
                <td>{{ cita.motivo }}</td>
                <td>{{ cita.estadoCita }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!citas || citas.length === 0" class="text-center text-gray-500 py-4">
            No hay ninguna cita por ahora
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./vete-modal-citasHoy.component.css']
})
export class VeteModalCitasHoyComponent {
  @Input() citas: Cita[] = [];
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
