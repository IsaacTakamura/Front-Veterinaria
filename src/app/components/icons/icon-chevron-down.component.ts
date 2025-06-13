import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-chevron-down',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" fill="none"
         [attr.class]="className" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  `,
})
export class IconChevronDownComponent {
  @Input() size: number = 16;
  @Input() className: string = '';
}
