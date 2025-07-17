import { Routes } from '@angular/router';
import { ListapacientesPageComponent } from './pages/listapacientes/listapacientes-page.component';
import { IndexPageComponent } from './pages/index/index-page.component';
import { RecetaPageComponent } from './pages/receta/receta-page.component';
import { LoginComponentPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { VeterinarioPageComponent } from './pages/veterinario/veterinario-page.component';
import { AdminIndexPageComponent } from './pages/admin-index/admin-index-page.component';
import { AgendarPageComponent } from './pages/agendar/agendar-page.component';
import { EnfermeraPageComponent } from './pages/enfermera/enfermera-page.component';
import { AsistenteLayoutComponent } from './layouts/asistente-layout/asistente-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: IndexPageComponent,
  },
  {
    path: 'listapacientes',
    component: ListapacientesPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login-page.component').then((m) => m.LoginComponentPageComponent),
  },
  {
    path: 'receta',
    component: RecetaPageComponent,
  },
  {
    path: 'veterinario',
    canActivate: [authGuard],
    data: { roles: ['VET'] },
    loadComponent: () =>
      import('./pages/veterinario/veterinario-page.component').then((m) => m.VeterinarioPageComponent),
  },
  // Agrupar admin bajo su layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin-index/admin-index-page.component').then((m) => m.AdminIndexPageComponent),
      },
    ],
  },
  {
    path: '',
    component: AsistenteLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['ASISTENTE'] },
    children: [
      {
        path: 'enfermera',
        loadComponent: () =>
          import('./pages/enfermera/enfermera-page.component').then((m) => m.EnfermeraPageComponent),
      },
      {
        path: 'agendar',
        component: AgendarPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

