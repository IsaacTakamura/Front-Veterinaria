import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './pages/index/index-page.component';
import { RecetaPageComponent } from './pages/receta/receta-page.component';
import { EnfermeraPageComponent } from './pages/enfermera/enfermera-page.component';



export const routes: Routes = [


{
  path: '',
  component: IndexPageComponent,
},
{
  path: 'receta',
  component: RecetaPageComponent,
},
{
  path: 'enfermera',
  component: EnfermeraPageComponent,
},


];
