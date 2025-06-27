import { Alquiler } from './../models/alquiler.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlquileresService {
  private readonly baseUrl = `${environment.apiUrl}/alquiler`;

  constructor(private http: HttpClient) {}

  getAlquileres(): Observable<Alquiler[]> {
    return this.http.get<Alquiler[]>(this.baseUrl);
  }

  confirmarAlquiler(id: number, observacion: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/confirmar`, {
      observacion,
    });
  }
}
