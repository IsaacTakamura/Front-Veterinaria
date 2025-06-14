import { Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index/index-page.component';
import { RecetaPageComponent } from './pages/receta/receta-page.component';
import { EnfermeraPageComponent } from './pages/enfermera/enfermera-page.component';
import { LoginComponent  } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { VeterinarioPageComponent } from './pages/veterinario/veterinario-page.component';
import { AdminIndexPageComponent } from './pages/admin-index/admin-index-page.component';
import { AgendarPageComponent } from './pages/agendar/agendar-page.component';

export const routes: Routes = [


{
  path: '',
  component: IndexPageComponent,
},
{
    path: 'register',
    component: RegisterPageComponent,
  },
{
  path: 'login',
  component: LoginComponent,
},
{
  path: 'receta',
  component: RecetaPageComponent,
},
{
  path: 'enfermera',
  component: EnfermeraPageComponent,
},
{
 path: 'veterinario',
 component: VeterinarioPageComponent,
},
{
  path: 'admin',
  component: AdminIndexPageComponent,
},
{
  path: 'agendar',
  component: AgendarPageComponent,
}
];
