import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginReqModel, LoginResModel } from '../models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

  private readonly baseUrl = `${environment.apiUrl}/login`;
  
  constructor(private http: HttpClient) {}

  login(formData:LoginReqModel): Observable<LoginResModel> {
    return this.http.post<LoginResModel>(this.baseUrl, formData)
  }
}
