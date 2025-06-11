import { Component } from '@angular/core';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RegisterFormComponent],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  // Este componente simplemente envuelve el formulario de registro
  // No necesita lógica adicional por ahora
}
