import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private readonly baseUrl = `${environment.apiUrl}/recovery`;

  constructor(private http: HttpClient) {}

  changePassword(data: {
    email: string;
    newPassword: string;
    currentPassword: string;
    //token: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, data);
  }
}