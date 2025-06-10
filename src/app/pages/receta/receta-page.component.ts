
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-receta-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./receta-page.component.html",
  styleUrls: ["./receta-page.component.css"],
})
export class RecetaPageComponent {
  title = "Sistema de Atención Veterinaria";
  nombreMascota: string = '';
  diagnostico: string = '';
  doctor: string = 'Nicolas alayo arias';
  fecha: string = new Date().toISOString().substring(0, 10);

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
