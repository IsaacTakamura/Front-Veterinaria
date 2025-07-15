import { ListapacientesPageComponent } from './pages/listapacientes/listapacientes-page.component';
import { Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index/index-page.component';
import { RecetaPageComponent } from './pages/receta/receta-page.component';
import { EnfermeraPageComponent } from './pages/enfermera/enfermera-page.component';
import { LoginComponentPageComponent  } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { VeterinarioPageComponent } from './pages/veterinario/veterinario-page.component';
import { AdminIndexPageComponent } from './pages/admin-index/admin-index-page.component';
import { AgendarPageComponent } from './pages/agendar/agendar-page.component';
import { AsistenteLayoutComponent } from './layouts/asistente-layout/asistente-layout.component';

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
    component: LoginComponentPageComponent,
  },
  {
    path: 'receta',
    component: RecetaPageComponent,
  },
  {
    path: 'veterinario',
    component: VeterinarioPageComponent,
  },
  {
    path: 'admin',
    component: AdminIndexPageComponent,
  },
  // Agrupar rutas de asistente bajo el layout
  {
    path: '',
    component: AsistenteLayoutComponent,
    children: [
      { path: 'enfermera', component: EnfermeraPageComponent },
      { path: 'agendar', component: AgendarPageComponent },
    ]
  }
];
