import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-user-plus',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" fill="none"
         [attr.class]="className" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M7 21v-2a4 4 0 0 1 4-4h1"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  `,
})
export class IconUserPlusComponent {
  @Input() size: number = 20;
  @Input() className: string = '';
}
