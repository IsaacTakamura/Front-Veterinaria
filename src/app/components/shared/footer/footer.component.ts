import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface QuickLink {
  label: string;
  route: string;
}

interface ContactInfo {
  icon: string;
  text: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks: QuickLink[] = [
    { label: 'Inicio', route: '/inicio' },
    { label: 'Características', route: '/caracteristicas' },
    { label: 'Servicios', route: '/servicios' },
    { label: 'Nosotros', route: '/nosotros' },
    { label: 'Contacto', route: '/contacto' }
  ];

  contactInfo: ContactInfo[] = [
    { icon: 'fas fa-map-marker-alt', text: 'Av. Principal 123, Santa Anita' },
    { icon: 'fas fa-phone', text: '(01) 123-4567' },
    { icon: 'fas fa-envelope', text: 'info@veterinariasantaanita.com' },
    { icon: 'fas fa-clock', text: 'Lun-Sáb: 9am - 7pm | Dom: 9am - 2pm' }
  ];

  socialLinks: SocialLink[] = [
    { name: 'Facebook', url: 'https://facebook.com/veterinariasantaanita', icon: 'fab fa-facebook-f' },
    { name: 'Instagram', url: 'https://instagram.com/veterinariasantaanita', icon: 'fab fa-instagram' },
    { name: 'Twitter', url: 'https://twitter.com/vetsantaanita', icon: 'fab fa-twitter' },
    { name: 'WhatsApp', url: 'https://wa.me/51123456789', icon: 'fab fa-whatsapp' }
  ];
}
