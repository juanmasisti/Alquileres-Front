import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
// AuthGuard is an Angular guard that checks if the user is authenticated before allowing access to certain routes.
// It implements the CanActivate interface from Angular's router module.
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/ingresar']);
      return false;
    }
  }
}
