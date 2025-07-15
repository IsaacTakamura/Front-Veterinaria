import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-calendar',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" [attr.fill]="color" [attr.stroke]="strokeColor" [attr.stroke-width]="strokeWidth">
      <path d="M8 2v3m8-3v3M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
    </svg>
  `,
  styles: []
})
export class IconCalendarComponent {
  @Input() size: string = '16';
  @Input() color: string = 'currentColor';
  @Input() strokeColor: string = 'currentColor';
  @Input() strokeWidth: string = '2';
}
