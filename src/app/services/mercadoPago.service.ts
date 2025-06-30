import { HttpClient, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginReqModel, LoginResModel } from '../models/login.model';
import { Observable } from 'rxjs';
import { RegisterModel } from '../models/register.model';
import { PagoModel } from '../models/pago.model';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  private readonly baseUrl = `${environment.apiUrl}/mercadoPago/preferenceId`;
  
  constructor(private http: HttpClient) {}

  getPreferenceId(pagoData: PagoModel, userEmail?: string): Observable<any> {
    let params: HttpParams = new HttpParams()
    for (const [key, value] of Object.entries(pagoData)) {
        params = params.set(key, value)
    }
    if (userEmail) {
      params = params.set('userEmail', userEmail);
    }
    return this.http.get<any>(this.baseUrl, { params });
  }
}