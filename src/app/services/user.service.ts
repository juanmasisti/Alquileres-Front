// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me`, user);
  }

  changePassword(data: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/cambiar-password`, data);
  }
}
