import { Injectable, signal } from '@angular/core';

@Injectable()
export class SidebarStateService {
  activeSection = signal<string>('lista-usuarios');
}
