import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IndexPageComponent } from './pages/index/index-page.component';

export const routes: Routes = [

{
  path: '',
  component: AppComponent,
},
{
  path: 'index',
  component: IndexPageComponent,
},




];
