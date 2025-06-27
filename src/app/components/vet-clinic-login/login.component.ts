import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword = signal(false);
  isLoading = signal(false);

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', res.token);
        this.authService.getUsuarioByUsername(username).subscribe({
          next: (userRes) => {
            const rol = userRes.rol;
            localStorage.setItem('user_info', JSON.stringify(userRes));
            this.isLoading.set(false);

            // Redirección según rol
            if (rol === 'ADMIN') this.router.navigate(['/admin']);
            else if (rol === 'VET') this.router.navigate(['/veterinario']);
            else if (rol === 'ASISTENTE') this.router.navigate(['/enfermera']);
            else this.router.navigate(['/']);
          },
          error: (err) => {
            this.isLoading.set(false);
            console.error('Error obteniendo información del usuario', err);
          }
        });
      },
      error: (err) => {
        console.error('Error de login', err);
        this.isLoading.set(false);
        // Aquí deberías implementar un mecanismo para mostrar mensajes de error
        // Por ejemplo, añadir un signal de mensaje en la clase
      }
    });
  }

}
