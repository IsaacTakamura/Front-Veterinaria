import { Component } from '@angular/core';
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
export class AsistenteSidebarComponent {}
