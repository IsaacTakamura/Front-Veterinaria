import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-settings',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" fill="none"
         [attr.class]="className" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15A1.65 1.65 0 0 0 21 12.6a1.65 1.65 0 0 0-1.6-2.6l-1.35-.33a1.72 1.72 0 0 1-1.18-1.18l-.33-1.35A1.65 1.65 0 0 0 15 2.6a1.65 1.65 0 0 0-2.6 1.6l-.33 1.35a1.72 1.72 0 0 1-1.18 1.18l-1.35.33A1.65 1.65 0 0 0 3 11.4a1.65 1.65 0 0 0 1.6 2.6l1.35.33a1.72 1.72 0 0 1 1.18 1.18l.33 1.35A1.65 1.65 0 0 0 9 21.4a1.65 1.65 0 0 0 2.6-1.6l.33-1.35a1.72 1.72 0 0 1 1.18-1.18l1.35-.33A1.65 1.65 0 0 0 21 12.6a1.65 1.65 0 0 0-1.6-2.6"/>
    </svg>
  `,
})
export class IconSettingsComponent {
  @Input() size: number = 20;
  @Input() className: string = '';
}
