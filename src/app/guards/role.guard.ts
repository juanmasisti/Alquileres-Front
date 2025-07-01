import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
// RoleGuard is an Angular guard that checks if the user has the required role to access a route.
// It implements the CanActivate interface from Angular's router module.
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean { // ActivatedRouteSnapshot contiene información sobre la ruta que se está activando
    const expectedRoles: string[] = route.data['roles']; // accede a los roles esperados desde los datos de la ruta
    const userRole = this.authService.getUserRole(); // implementá este método en AuthService

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
      // Podés redirigir a un "no autorizado" o a home
      this.router.navigate(['/']);
      return false;
    }
  }
}
