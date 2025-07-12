import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: "app-navbar-public",
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: "./navbar-public.component.html",
  styleUrls: ["./navbar-public.component.css"],
})
export class NavbarPublicComponent {
  constructor(public session: SessionService) {}
  title = "Sistema de Atención Veterinaria";

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
