import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TriajeService } from '../../../core/services/triaje.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Triaje } from '../../shared/interfaces/triaje.model';
import { Mascota } from '../../shared/interfaces/mascota.model';

@Component({
  selector: 'app-triaje-modal',
  templateUrl: './triaje-modal.component.html',
  styleUrls: ['./triaje-modal.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TriajeModalComponent {
  // Señales para el estado
  isOpenSignal = signal(false);
  cargando = signal(false);
  mascotaCompleta = signal<Mascota | null>(null);
  triajeExistente = signal<Triaje | null>(null);
  esModoEdicion = signal(false);

  // Inputs y outputs
  @Input() set isOpen(value: boolean) {
    this.isOpenSignal.set(value);
    if (value && this.cita) {
      this.cargarDatosMascota();
      this.verificarTriajeExistente();
    }
  }
  @Input() cita: any = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() triajeCreado = new EventEmitter<any>();
  @Output() triajeActualizado = new EventEmitter<any>();

  triajeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private triajeService: TriajeService,
    private mascotaService: MascotaService
  ) {
    this.triajeForm = this.fb.group({
      temperatura: ['', [Validators.required, Validators.min(30), Validators.max(45)]],
      peso: ['', [Validators.required, Validators.min(0.1), Validators.max(200)]],
      frecuenciaCardiaca: ['', [Validators.required, Validators.min(40), Validators.max(300)]],
      frecuenciaRespiratoria: ['', [Validators.required, Validators.min(10), Validators.max(100)]],
      observaciones: ['']
    });
  }

  // Método para cargar datos completos de la mascota
  private cargarDatosMascota(): void {
    if (!this.cita?.mascotaId) return;

    this.mascotaService.listarMascotaPorId(this.cita.mascotaId).subscribe({
      next: (response) => {
        this.mascotaCompleta.set(response.data);
      },
      error: (error) => {
        console.error('Error al cargar datos de la mascota:', error);
      }
    });
  }

  // Método para verificar si ya existe un triaje para la mascota
  private verificarTriajeExistente(): void {
    if (!this.cita?.mascotaId) return;

    this.cargando.set(true);
    this.triajeService.obtenerTriajePorMascotaId(this.cita.mascotaId).subscribe({
      next: (response: any) => {
        if (response && response.data && response.data.length > 0) {      // Ya existe un triaje, cargar datos para edición
          const triaje = response.data[0]; // Tomamos el más reciente
          this.triajeExistente.set(triaje);
          this.esModoEdicion.set(true);
          this.cargarDatosEnFormulario(triaje);
        } else {      // No existe triaje, modo creación
          this.esModoEdicion.set(false);
          this.triajeExistente.set(null);
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al verificar triaje existente:', error);
        this.esModoEdicion.set(false);
        this.cargando.set(false);
      }
    });
  }

  // Método para cargar datos existentes en el formulario
  private cargarDatosEnFormulario(triaje: Triaje): void {
    this.triajeForm.patchValue({
      temperatura: triaje.temperatura,
      peso: triaje.peso,
      frecuenciaCardiaca: triaje.frecuenciaCardiaca,
      frecuenciaRespiratoria: triaje.frecuenciaRespiratoria,
      observaciones: triaje.observaciones || ''
    });
  }

  // Método para crear o actualizar el triaje
  onSubmit(): void {
    if (this.triajeForm.valid && this.cita?.mascotaId) {
      this.cargando.set(true);

      if (this.esModoEdicion() && this.triajeExistente()) {        // Modo edición - actualizar triaje existente (NO enviar mascotaId)
        const datosTriaje: Triaje = {
          triajeId: this.triajeExistente()!.triajeId, // Incluir el ID del triaje
          temperatura: this.triajeForm.value.temperatura,
          peso: this.triajeForm.value.peso,
          frecuenciaCardiaca: this.triajeForm.value.frecuenciaCardiaca,
          frecuenciaRespiratoria: this.triajeForm.value.frecuenciaRespiratoria,
          observaciones: this.triajeForm.value.observaciones
          // No se incluye mascotaId en modo edición
        };

        this.triajeService.actualizarTriaje(this.triajeExistente()!.triajeId!, datosTriaje).subscribe({
          next: (response) => {
            console.log('Triaje actualizado exitosamente:', response);
            this.cargando.set(false);
            this.cerrarModal();
            this.triajeActualizado.emit(response);
          },
          error: (error) => {
            console.error('Error al actualizar triaje:', error);
            this.cargando.set(false);
          }
        });
      } else {  // Modo creación - crear nuevo triaje (SÍ enviar mascotaId)
        const datosTriaje: Triaje = {
          temperatura: this.triajeForm.value.temperatura,
          peso: this.triajeForm.value.peso,
          frecuenciaCardiaca: this.triajeForm.value.frecuenciaCardiaca,
          frecuenciaRespiratoria: this.triajeForm.value.frecuenciaRespiratoria,
          observaciones: this.triajeForm.value.observaciones,
          mascotaId: this.cita.mascotaId
        };

        this.triajeService.crearTriaje(datosTriaje).subscribe({
          next: (response) => {
            console.log('Triaje creado exitosamente:', response);
            this.cargando.set(false);
            this.cerrarModal();
            this.triajeCreado.emit(response);
          },
          error: (error) => {
            console.error('Error al crear triaje:', error);
            this.cargando.set(false);
          }
        });
      }
    }
  }

  // Método para cerrar el modal
  onCancel(): void {
    this.cerrarModal();
  }

  // Método para cerrar y limpiar
  private cerrarModal(): void {
    this.triajeForm.reset();
    this.mascotaCompleta.set(null);
    this.triajeExistente.set(null);
    this.esModoEdicion.set(false);
    this.cargando.set(false);
    this.closeModal.emit();
  }

  // Método para obtener el nombre de la mascota
  getNombreMascota(): string {
    return this.mascotaCompleta()?.nombre || this.cita?.paciente || 'Mascota';
  }

  // Método para obtener el texto del botón según el modo
  getBotonTexto(): string {
    if (this.cargando()) {
      return this.esModoEdicion() ? 'Actualizando...' : 'Guardando...';
    }
    return this.esModoEdicion() ? 'Actualizar triaje' : 'Guardar y enviar a veterinario';
  }

  // Método para obtener el título del modal según el modo
  getTituloModal(): string {
    return this.esModoEdicion() ? 'Editar Triaje' : 'Nuevo Triaje';
  }

  // Método para validar si el formulario está deshabilitado
  isFormDisabled(): boolean {
    return this.cargando() || this.triajeForm.invalid;
  }
}
