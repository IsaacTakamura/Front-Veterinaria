import { Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index/index-page.component';
import { RecetaPageComponent } from './pages/receta/receta-page.component';
import { EnfermeraPageComponent } from './pages/enfermera/enfermera-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { VeterinarioPageComponent } from './pages/veterinario/veterinario-page.component';

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
  component: LoginPageComponent,
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
];
