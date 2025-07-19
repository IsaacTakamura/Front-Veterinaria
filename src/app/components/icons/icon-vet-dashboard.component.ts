import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-vet-dashboard',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="4" [attr.stroke]="color" [attr.stroke-width]="strokeWidth" fill="none" />
      <path d="M8 12h8M12 8v8" [attr.stroke]="color" [attr.stroke-width]="strokeWidth" stroke-linecap="round" />
    </svg>
  `
})
export class IconVetDashboardComponent {
  @Input() size: number = 24;
  @Input() color: string = '#2563eb';
  @Input() strokeWidth: number = 2;
}
