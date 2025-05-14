import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      title: "Manny Maquinarias"
    },
    component: HomeComponent
  },
    {
    path: 'home',
    data: {
      title: "Manny Maquinarias"
    },
    component: HomeComponent
  },
  {
    path: 'contact',
    data: {
      title: "Contacto"
    },
    component: ContactComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
