import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly baseUrl = `${environment.apiUrl}/estadisticas`;

  constructor(private http: HttpClient) {}

  getIngresos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ingresos`);
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`);
  }

  getAlquileres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/alquileres`);
  }
}
