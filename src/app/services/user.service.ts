// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(
      `${this.baseUrl}/${this.authService.getUserId()}`
    );
  }

  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `${this.baseUrl}/${this.authService.getUserId()}`,
      user
    );
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/cambiar-password`, data);
  }


  ValidToken(body: { email: string; token: string }): Observable<any> {
    return this.http.get(`${this.baseUrl}/valid-token`);
  }

  RecoverPassword(body: { email: string }): Observable<any> { 
    return this.http.post(`${this.baseUrl}/recovery-password`, body);
  }

}
