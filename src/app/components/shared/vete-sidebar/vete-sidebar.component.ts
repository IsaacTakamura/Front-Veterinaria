import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconVetDashboardComponent } from '../../icons/icon-vet-dashboard.component';
import { IconListapacientesComponent } from '../../icons/icon-listapacientes.component';

@Component({
  selector: 'app-vete-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconVetDashboardComponent, IconListapacientesComponent],
  templateUrl: './vete-sidebar.component.html',
  styleUrls: ['./vete-sidebar.component.css']
})
export class VeteSidebarComponent {
  @Input() activeSection!: string;
  @Output() sectionChange = new EventEmitter<string>();

  constructor(private router: Router) {}

  goTo(section: string) {
    this.sectionChange.emit(section);
    if (section === 'dashboard') {
      this.router.navigate(['/veterinario']);
    } else if (section === 'pacientes') {
      this.router.navigate(['/listapacientes']);
    }
  }
}
