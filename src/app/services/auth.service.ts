import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginReqModel, LoginResModel } from '../models/login.model';
import { delay, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(data: LoginReqModel): Observable<LoginResModel> {
    return this.http.post<LoginResModel>(`${environment.apiUrl}/login`, data).pipe(delay(1000));
  }

  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

   //@TODO ver como obtener datos del payload del token
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol || null;
  }

   //@TODO ver como obtener datos del payload del token
  getUserEmail(): string | null { 
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || null;
  }

  //@TODO ver como obtener datos del payload del token
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || null;
  }

}
