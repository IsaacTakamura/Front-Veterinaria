import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required]], // Cambiado de 'email' a 'username'
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

    setTimeout(() => {
      this.isLoading.set(false);
      console.log('Formulario enviado', this.form.value);
    }, 2000);
  }
}
