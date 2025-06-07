import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-veterinaria2-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./veterinaria2-page.component.html",
  styleUrls: ["./veterinaria2-page.component.css"],
})
export class Veterinaria2PageComponent {
  title = "veterinaria ejemplo";

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
