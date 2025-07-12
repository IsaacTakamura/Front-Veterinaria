import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginComponentPageComponent {
  username = '';
  password = '';
  error = '';
  showPassword = false;

  constructor(
    public authService: AuthService,
    public session: SessionService,
    public router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
  this.authService.login(this.username, this.password).subscribe({
    next: (res: any) => {
      const token = res.token;
      const username = res.nombre; // O res.username, según tu backend

      // Guardar el token
      localStorage.setItem('auth_token', token);

      // ✅ Llamada adicional para obtener el rol
      this.authService.getUserInfo(username).subscribe({
        next: (userInfo) => {
          const rol = userInfo.rol; // Asegúrate que esta propiedad exista

          console.log('📦 Rol obtenido desde API:', rol);

          // Guardar en session service
          this.session.login(token, {
            username,
            rol
          });

          // Redirigir según rol
          switch (rol) {
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
        error: () => {
          this.error = 'Error al obtener datos del usuario.';
        }
      });
    },
    error: () => {
      this.error = 'Usuario o contraseña incorrectos.';
    }
  });
}

}
