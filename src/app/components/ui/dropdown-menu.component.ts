import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { AvatarComponent } from './avatar.component'; // Adjust the path as needed

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [ NgTemplateOutlet, AvatarComponent],
  template: `
    <div class="relative group">
      <button class="h-10 w-10 rounded-full border-2 border-emerald-200 overflow-hidden focus:outline-none">
        <app-avatar [src]="avatar" [fallbackText]="initials" />
      </button>

      <div class="hidden group-hover:flex absolute right-0 mt-2 w-56 flex-col bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
        <ng-container *ngTemplateOutlet="dropdownLabel"></ng-container>
        <hr class="my-2" />
        <ng-container *ngTemplateOutlet="dropdownContent"></ng-container>
      </div>
    </div>
  `,
})
export class DropdownMenuComponent {
  @Input() avatar: string = '';
  @Input() initials: string = '??';

  @ContentChild('dropdownLabel') dropdownLabel!: TemplateRef<any>;
  @ContentChild('dropdownContent') dropdownContent!: TemplateRef<any>;
}
