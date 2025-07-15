import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconStethoscopeComponent } from '../../icons/icon-stethoscope.component';
import { IconCalendarComponent } from '../../icons/icon-calendar.component';
import { IconDocumentComponent } from '../../icons/icon-document.component';

@Component({
  selector: 'app-asistente-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconStethoscopeComponent, IconCalendarComponent, IconDocumentComponent],
  templateUrl: './asistente-sidebar.component.html',
  styleUrls: ['./asistente-sidebar.component.css']
})
export class AsistenteSidebarComponent {
  @Input() activeSection!: string;
  @Output() sectionChange = new EventEmitter<string>();

  constructor(private router: Router) {}

  goTo(section: string) {
    this.sectionChange.emit(section);
    if (section === 'hoy') {
      this.router.navigate(['/enfermera']);
    } else if (section === 'agendar') {
      this.router.navigate(['/agendar']);
    }
  }
}
