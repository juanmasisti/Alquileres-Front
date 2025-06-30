// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile(): Observable<User> {
    const userId = this.authService.getUserId();

    if (!userId) {
      // Puede pasar si se pierde el token o si se llama antes de iniciar sesión
      console.warn('No se encontró ID de usuario en sessionStorage');
      return throwError(() => new Error('ID de usuario no encontrado'));
    }

    return this.http.get<User>(`${this.baseUrl}/${userId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener perfil del usuario:', error);
        // Podés retornar un observable vacío o un valor por defecto
        return throwError(() => error); // o return of(null) si preferís no cortar el flujo
      })
    );
  }

  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `${this.baseUrl}/${this.authService.getUserId()}`,
      user
    );
  }

  ValidToken(body: { email: string; token: string }): Observable<any> {
    return this.http.get(`${this.baseUrl}/valid-token`);  
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.authService.getUserId()}/deactivate`)
  }

  //obtener todos los usuarios
  getAllUsers() {
  return this.http.get<any[]>(`${this.baseUrl}`); 
  }

  //desactivar usuario
  deactivateUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/deactivate`);
  }

  // createClientAndEmployee(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/create`, data).pipe(
  //     catchError((error) => {
  //       console.error('Error al crear usuario:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }
}