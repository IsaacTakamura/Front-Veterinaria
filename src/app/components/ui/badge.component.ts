import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClass">
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: 'default' | 'secondary' | 'destructive' = 'default';

  get badgeClass() {
    const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold';
    const styles = {
      default: 'bg-gray-100 text-gray-800',
      secondary: 'bg-gray-200 text-gray-900',
      destructive: 'bg-red-500 text-white',
    };
    return `${base} ${styles[this.variant]}`;
  }
}
