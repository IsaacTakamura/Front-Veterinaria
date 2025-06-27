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
import { SessionService } from '../../core/services/session.service'; // Asegúrate de que la ruta sea correcta

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
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private session: SessionService
  ) {}

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  // Add this signal at the class level
  message = signal<{type: string, text: string} | null>(null);

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        this.authService.getUsuarioByUsername(username).subscribe({
          next: (userRes) => {
            const user = userRes;
            this.session.login(res.token, user);
            this.isLoading.set(false);

            const rol = user.rol;
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
        this.message.set({ type: 'error', text: 'Credenciales incorrectas' });
        this.isLoading.set(false);
      }
    });
  }
}
