import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private readonly baseUrl = `${environment.apiUrl}/reserva`;

  constructor(private http: HttpClient) {}

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.baseUrl);
  }

  cancelarReserva(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/cancelar`, {});
  }
  confirmarReserva(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/confirmar`, {});
  }
}