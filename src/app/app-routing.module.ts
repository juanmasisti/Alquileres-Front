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
import { IngresarCodigoComponent } from './pages/ingresar-codigo/ingresar-codigo.component';
import { LoginComponent } from './pages/login/Login.component';
import { ManagementComponent } from './pages/management/management.component';
import { UsersComponent } from './pages/users/users.component';
import { CreateClientComponent } from './pages/create-client/create-client.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

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
    path: 'usuarios',
    data: {
      title: 'Usuarios',
      roles: ['admin'] // Solo los administradores pueden acceder a esta ruta
    },
    component: UsersComponent,
    canActivate: [AuthGuard, RoleGuard],
  }
  ,
  // fin navbar
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
    canActivate: [AuthGuard],
  },
  {
    path: `perfil/id/cambiar-clave`,
    data: {
      title: 'Cambiar clave',
    },
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recuperar-clave',
    data: {
      title: 'Recuperar clave',
    },
    component: PasswordRecoveryComponent,
  },
  {
    path: 'recovery',
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
  {
    path: 'ingresar-codigo/token',
    data: {
      title: 'Ingresar código',
    },
    component: IngresarCodigoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gestiones',
    data: {
      title: 'Gestiones',
    },
    component: ManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'crear-cliente',
    data: {
      title: 'Crear Cliente',
      roles: ['empleado'] // Solo los empleados pueden acceder a esta ruta
    },
    component: CreateClientComponent,
    canActivate: [AuthGuard, RoleGuard],
  }
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
