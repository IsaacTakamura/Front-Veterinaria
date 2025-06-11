import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./navbar-public.component.html",
  styleUrls: ["./navbar-public.component.css"],
})
export class NavbarPublicComponent {
  title = "Sistema de Atención Veterinaria";

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
