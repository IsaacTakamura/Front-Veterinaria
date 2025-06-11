import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

type RolEnum = 'ADMIN' | 'VET' | 'ASISTENTE';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent {
  form: ReturnType<FormBuilder['group']>;

  showPassword = signal(false);
  isLoading = signal(false);
  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  get roleDescription(): string {
    const rol = this.form.value.rol;
    switch (rol) {
      case 'ADMIN':
        return 'Administrador del sistema con acceso completo';
      case 'VET':
        return 'Veterinario - Diagnóstico, tratamiento y seguimiento';
      case 'ASISTENTE':
        return 'Asistente - Triaje, datos vitales y apoyo general';
      default:
        return '';
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.message.set({ type: 'error', text: 'Todos los campos son obligatorios' });
      return;
    }

    this.message.set(null);
    this.isLoading.set(true);

    try {
      const result = await this.authService.register(this.form.value).toPromise();
      this.message.set({ type: 'success', text: 'Usuario registrado exitosamente' });
      this.form.reset();
    } catch (error) {
      this.message.set({ type: 'error', text: 'Error al registrar usuario. Intente nuevamente.' });
    } finally {
      this.isLoading.set(false);
    }
  }
}
