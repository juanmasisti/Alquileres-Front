import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { RegisterComponent } from './pages/register/register.component';
import { MaquinaryProfileComponent } from './pages/maquinary-profile/maquinary-profile.component';
import { PersonProfileComponent } from './pages/person-profile/person-profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component';
import { SetNewPasswordComponent } from './pages/set-new-password/set-new-password.component';
import { TestComponent } from './pages/testear/testear.component';
import { Title } from '@angular/platform-browser';
import { LoginComponent } from './pages/login/login.component';

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
    path: 'quienes-somos',
    data: {
      title: 'Quienes somos',
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
    path: 'perfil',
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
  {
    path: 'recuperar-clave',
    data: {
      title: 'Recuperar clave',
    },
    component: PasswordRecoveryComponent,
  },
  {
    path: 'recuperar-clave/token',
    data: {
      title: 'Recuperar clave',
    },
    component: SetNewPasswordComponent,
  },
  {
    path: 'test',
    data: {
      title: 'test',
    },
    component: TestComponent,
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
