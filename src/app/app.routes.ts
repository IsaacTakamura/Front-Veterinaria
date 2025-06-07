import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './pages/index/index-page.component';
import { Veterinaria2PageComponent } from './pages/veterinaria2/veterinaria2-page.component';



export const routes: Routes = [


{
  path: '',
  component: IndexPageComponent,
},
{
  path: 'veterinaria2',
  component: Veterinaria2PageComponent,
}


];
