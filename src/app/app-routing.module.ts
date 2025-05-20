import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/Login/Login.component';
import { MaquinaryProfileComponent } from './pages/maquinary-profile/maquinary-profile.component';
import { PersonProfileComponent } from './pages/person-profile/person-profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    data: {
      title: 'Manny Maquinarias',
    },
    component: HomeComponent,
  },
  {
    path: 'inicio',
    data: {
      title: 'Manny Maquinarias',
    },
    component: HomeComponent,
  },

  {
    path: 'contacto',
    data: {
      title: 'Contacto',
    },
    component: ContactComponent,
  },
  {
    path: 'registrar',
    data: {
      title: 'Registro',
    },
    component: RegisterComponent,
  },
  {
    path: 'ingresar',
    data: {
      title: 'Ingreso',
    },
    component: LoginComponent,
  },
  {
    path: 'maquinaria/:id',
    data: {
      title: 'Maquinaria',
    },
    component: MaquinaryProfileComponent,
  },
  {
    path: 'perfil/id',
    data: {
      title: 'Perfil',
    },
    component: PersonProfileComponent,
  },
  {
    path: `perfil/id/cambiar-clave`,
    data: {
      title: 'Cambiar clave',
    },
    component: ChangePasswordComponent,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
