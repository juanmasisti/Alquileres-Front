import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly baseUrl = `${environment.apiUrl}/estadisticas`;

  constructor(private http: HttpClient) {}

  getIngresos(tam?: string): Observable<any[]> {
    let params = new HttpParams();
    if (tam) params = params.set('tam', tam);
    return this.http.get<any[]>(`${this.baseUrl}/ingresos`, { params });
  }

  getClientes(tam?: string): Observable<any[]> {
    let params = new HttpParams();
    if (tam) params = params.set('tam', tam);
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`, { params });
  }

  getAlquileres(tam?: string): Observable<any[]> {
    let params = new HttpParams();
    if (tam) params = params.set('tam', tam);
    return this.http.get<any[]>(`${this.baseUrl}/alquileres`, { params });
  }

}
