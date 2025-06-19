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
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta

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
      this.isLoading.set(false);

      // Guarda token y rol en el localStorage
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('user_rol', res.rol);

      // Redirecciona según rol
      switch (res.rol) {
        case 'ADMIN':
          this.router.navigate(['/admin']);
          break;
        case 'VET':
          this.router.navigate(['/veterinario']);
          break;
        case 'ASISTENTE':
          this.router.navigate(['/enfermera']);
          break;
        default:
          this.router.navigate(['/']);
          break;
      }
    },
    error: (err) => {
      this.isLoading.set(false);
      console.error('Error de login', err);
      // Aquí puedes agregar visual feedback si deseas
    }
  });
}

}
