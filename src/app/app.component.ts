import { Component, computed, signal, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarPublicComponent } from './components/shared/navbar-public/navbar-public.component';
import { NavbarPrivateComponent } from './components/shared/navbar-private/navbar-private.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ChatBotComponent } from './components/shared/chat-bot/chat-bot.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarPublicComponent,
    NavbarPrivateComponent,
    FooterComponent,
    CommonModule,
    ChatBotComponent
  ]
})
export class AppComponent implements OnInit {
  currentRoute = signal<string>('');
  isLoggedIn = signal<boolean>(false);
  showNavbarPublic = signal<boolean>(true);

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;

      this.currentRoute.set(url);

      const token = localStorage.getItem('auth_token');
      this.isLoggedIn.set(!!token);

      const publicRoutes = ['/', '/login', '/register'];
      const isPublicRoute = publicRoutes.some(route => url.startsWith(route));

      this.showNavbarPublic.set(!token && isPublicRoute);
    });
  }

  isLoginPage = computed(() => this.currentRoute().includes('/login'));
}
