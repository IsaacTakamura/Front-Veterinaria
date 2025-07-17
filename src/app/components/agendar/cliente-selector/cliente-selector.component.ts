import { Component, EventEmitter, Output } from '@angular/core';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../shared/interfaces/cliente.model';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-selector',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ClienteSelectorComponent {
  @Output() clienteSeleccionado = new EventEmitter<Cliente>();

  searchControl = new FormControl('');
  resultados: Cliente[] = [];
  mostrarModal = false;

  constructor(private clienteService: ClienteService) {}

  buscar() {
    const nombre = this.searchControl.value;
    if (nombre && nombre.trim().length > 0) {
      this.clienteService.buscarPorNombre(nombre).subscribe({
        next: (response) => {
          this.resultados = Array.isArray(response.data) ? response.data : [];
          console.log('Resultados recibidos:', this.resultados);
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.resultados = [];
        }
      });
    } else {
      this.resultados = [];
    }
  }

  seleccionar(cliente: Cliente) {
    this.clienteSeleccionado.emit(cliente);
    this.mostrarModal = false;
  }

  abrirModal() {
    this.mostrarModal = true;
    this.searchControl.setValue('');
    this.resultados = [];
  }
}
