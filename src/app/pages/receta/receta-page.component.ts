import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-receta-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./receta-page.component.html",
  styleUrls: ["./receta-page.component.css"],
})
export class RecetaPageComponent {
  title = "Sistema de Atención Veterinaria";

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
