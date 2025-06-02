import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { UserService } from './user.service';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private readonly baseUrl = `${environment.apiUrl}/reserva`;

  constructor(private http: HttpClient) {}

  getReservas(token: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.baseUrl);
  }

  
}
