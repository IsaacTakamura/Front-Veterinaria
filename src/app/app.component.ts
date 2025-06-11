import { Component, computed, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarPublicComponent } from './components/shared/navbar-public/navbar-public.component';
import { NavbarPrivateComponent } from './components/shared/navbar-private/navbar-private.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarPublicComponent, NavbarPrivateComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentRoute = signal<string>('');

  // Simulación de login
  isLoggedIn = signal<boolean>(false); // cambia esto cuando el usuario se loguee de verdad

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute.set(event.url);
    });
  }

  isLoginPage = computed(() => this.currentRoute().includes('/login'));
}
