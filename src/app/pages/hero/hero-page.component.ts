import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-hero-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-page.component.html',
  styleUrls: ['./hero-page.component.css']
})

export class HeroPageComponent {
  title = 'Sistema de Atención Veterinaria';

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
