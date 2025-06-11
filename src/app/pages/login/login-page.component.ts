import { Component } from '@angular/core';
import { LoginComponent } from '../../components/vet-clinic-login/login.component'; // ajusta ruta si es diferente

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {}
