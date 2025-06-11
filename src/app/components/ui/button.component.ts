import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button [ngClass]="classes" [type]="type">
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: 'ghost' | 'default' = 'default';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() type: 'button' | 'submit' = 'button';

  get classes() {
    const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none';
    const variants = {
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
      default: 'bg-emerald-600 text-white hover:bg-emerald-700',
    };
    const sizes = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-10 px-4 text-base',
    };
    return `${base} ${variants[this.variant]} ${sizes[this.size]}`;
  }
}
