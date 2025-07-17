import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-listapacientes',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" [attr.stroke]="color" [attr.stroke-width]="strokeWidth" fill="none" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" [attr.stroke]="color" [attr.stroke-width]="strokeWidth" fill="none" />
    </svg>
  `
})
export class IconListapacientesComponent {
  @Input() size: number = 24;
  @Input() color: string = '#2563eb';
  @Input() strokeWidth: number = 2;
}
