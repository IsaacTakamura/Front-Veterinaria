import { Component, EventEmitter, Output } from '@angular/core';
import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota } from '../../shared/interfaces/mascota.model';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mascota-selector',
  templateUrl: './mascota-selector.component.html',
  styleUrls: ['./mascota-selector.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class MascotaSelectorComponent {
  @Output() mascotaSeleccionada = new EventEmitter<Mascota>();

  searchControl = new FormControl('');
  resultados: Mascota[] = [];
  mostrarModal = false;

  constructor(private mascotaService: MascotaService) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(nombre => nombre !== null && nombre !== '' && nombre.trim().length > 0),
      switchMap(nombre => this.mascotaService.buscarPorNombre(nombre!))
    ).subscribe({
      next: (response) => {
        // Verificar si response.data es un array o un objeto individual
        if (response.data) {
          this.resultados = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          this.resultados = [];
        }
        console.log('Resultados mascotas:', this.resultados);
      },
      error: (error) => {
        console.error('Error en búsqueda de mascotas:', error);
        this.resultados = [];
      }
    });
  }

  seleccionar(mascota: Mascota) {
    this.mascotaSeleccionada.emit(mascota);
    this.mostrarModal = false;
  }

  abrirModal() {
    this.mostrarModal = true;
    this.searchControl.setValue('');
    this.resultados = [];
  }
}
