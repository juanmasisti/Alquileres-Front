import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Maquinaria, MaquinariaFilters } from '../models/maquinaria.model';

@Injectable({ providedIn: 'root' })
export class MaquinariaService {
  private readonly baseUrl = `${environment.apiUrl}/maquinaria`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el listado de maquinarias, aplicando filtros si se proveen.
   * @param filters Filtros opcionales por estado, texto, política, etc.
   * pasando el objeto filters como query params.
   */
  getAll(filters?: MaquinariaFilters): Observable<Maquinaria[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<Maquinaria[]>(this.baseUrl, { params });
  }

  /**
   * Obtiene el detalle de una maquinaria por ID.
   */
  getById(id: number): Observable<Maquinaria> {
    return this.http.get<Maquinaria>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea una nueva maquinaria.
   */
  create(maquinaria: Maquinaria): Observable<any> {
    return this.http.post(this.baseUrl, maquinaria);
  }

  /**
   * Actualiza parcialmente una maquinaria existente.
   */
  update(id: number, maquinaria: Partial<Maquinaria>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, maquinaria);
  }

  /**
   * Elimina (lógicamente) una maquinaria.
   */
  eliminar(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/eliminar`, {});
  }

  /**
   * Restaura una maquinaria previamente eliminada.
   */
  restaurar(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/restaurar`, {});
  }

  /**
   * Oculta una maquinaria del público.
   */
  esconder(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/esconder`, {});
  }

  /**
   * Vuelve a mostrar una maquinaria que estaba oculta.
   */
  mostrar(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/mostrar`, {});
  }

  /**
   * Obtiene las categorías posibles para filtrar maquinarias.
   */
  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categorias`);
  }

  /**
   * Obtiene las políticas de devolución posibles.
   */
  getPoliticas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/politicas`);
  }

  /**
   * Obtiene las sucursales posibles para filtrar.
   */
  getSucursales(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/sucursales`);
  }

  /**
   * Obtiene los estados posibles (según rol/token).
   */
  getEstados(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/estados`);
  }
}
