import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Triaje } from '../../shared/interfaces/triaje.model';

@Component({
  selector: 'app-triaje-actual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './triaje-actual.component.html',
  styleUrls: ['./triaje-actual.component.css']
})
export class TriajeActualComponent {
  @Input() triaje: Triaje | null = null;
  @Input() cargando: boolean = false;
  @Input() modoEdicion: boolean = false;
  @Output() actualizarTriaje = new EventEmitter<Triaje>();
  @Output() cambiarModoEdicion = new EventEmitter<boolean>();

  onActualizarTriaje() {
    if (this.triaje) {
      this.actualizarTriaje.emit(this.triaje);
    }
  }

  onCambiarModoEdicion(modo: boolean) {
    this.cambiarModoEdicion.emit(modo);
  }
}
