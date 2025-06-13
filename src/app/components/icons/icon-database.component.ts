import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-database',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" fill="none"
         [attr.class]="className" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
      <path d="M3 17c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
    </svg>
  `,
})
export class IconDatabaseComponent {
  @Input() size: number = 20;
  @Input() className: string = '';
}
