import { Component, Input } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [NgIf, NgClass],
  template: `
    <div class="relative inline-block rounded-full overflow-hidden bg-gray-200" [ngClass]="size">
      <img *ngIf="src; else fallback" [src]="src" [alt]="alt" class="object-cover w-full h-full" />
      <ng-template #fallback>
        <div class="flex items-center justify-center w-full h-full text-sm font-semibold text-emerald-700 bg-gradient-to-br from-emerald-100 to-blue-100">
          {{ fallbackText }}
        </div>
      </ng-template>
    </div>
  `,
})
export class AvatarComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() fallbackText = '??';
  @Input() size = 'w-10 h-10';
}
