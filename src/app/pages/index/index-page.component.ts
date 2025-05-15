import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-index-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./index-page.component.html",
  styleUrls: ["./index-page.component.css"],
})
export class IndexPageComponent {
  title = "Sistema de Atención Veterinaria";

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
