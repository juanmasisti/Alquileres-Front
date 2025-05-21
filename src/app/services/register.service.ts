import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginReqModel, LoginResModel } from '../models/login.model';
import { Observable } from 'rxjs';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private readonly baseUrl = `${environment.apiUrl}/register`;
  
  constructor(private http: HttpClient) {}

  register(formData:RegisterModel): Observable<HttpStatusCode> {
    return this.http.post<HttpStatusCode>(this.baseUrl, formData)
  }
}
