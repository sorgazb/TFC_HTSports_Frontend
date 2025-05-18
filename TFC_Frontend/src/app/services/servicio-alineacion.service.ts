import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alienacion } from '../class/alienacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioAlineacionService {
  //private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/alineaciones'

  constructor(private http: HttpClient) { }

  crearAlineacion(alineacion: Alienacion): Observable<Alienacion>{
    return this.http.post<Alienacion>(`${this.apiUrl}${this.endPoint}`,alineacion)
  }

  obtenerAlienacionesEquipo(id: number): Observable<Alienacion[]>{
    return this.http.get<Alienacion[]>(`${this.apiUrl}${this.endPoint}/equipo/${id}`)
  }
}
