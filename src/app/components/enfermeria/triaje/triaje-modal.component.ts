import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-triaje-modal',
  templateUrl: './triaje-modal.component.html',
  styleUrls: ['./triaje-modal.component.css'], // si usás Tailwind, podés quitar esto
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] // <-- Agrega esto
})
export class TriajeModalComponent {
  // Cambiar nombre de la señal (isOpen => isOpenSignal)
  isOpenSignal = signal(false); // ✅ Nombre único

  // Mantener input con su nombre original
  @Input() set isOpen(value: boolean) {
    this.isOpenSignal.set(value); // ✅ Usar la señal renombrada
  }
  @Input() cita: any = null;
  @Output() closeModal = new EventEmitter<void>();

  triajeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.triajeForm = this.fb.group({
      temperatura: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      frecuenciaCardiaca: ['', [Validators.required]],
      frecuenciaRespiratoria: ['', [Validators.required]],
      observaciones: ['']
    });
  }

  onSubmit(): void {
    if (this.triajeForm.valid) {
      const datosTriaje = {
        citaId: this.cita?.id,
        ...this.triajeForm.value
      };

      console.log(datosTriaje);
      this.closeModal.emit();
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
