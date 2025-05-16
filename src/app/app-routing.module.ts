import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/Login.component';

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
    path: 'inicio',
    data: {
      title: "Manny Maquinarias"
    },
    component: HomeComponent
  },
  
  {
    path: 'contacto',
    data: {
      title: "Contacto"
    },
    component: ContactComponent
  },
  {
    path: 'registro',
    data: {
      title: "Registro"
    },
    component: RegisterComponent
  },
  {
    path: 'login',
    data: {
      title: "Login"
    },
    component: LoginComponent
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
