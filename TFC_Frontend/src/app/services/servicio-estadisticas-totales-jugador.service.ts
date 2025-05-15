import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstadisticasTotalesJugador } from '../class/estadisticas-totales-jugador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioEstadisticasTotalesJugadorService {

  private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  //private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/estadisticasJugadores'
  
  constructor(private http: HttpClient) { }

  obtenerEstadisticasTotalesJugador(jugadorId: number): Observable<EstadisticasTotalesJugador>{
    return this.http.get<EstadisticasTotalesJugador>(`${this.apiUrl}${this.endPoint}/${jugadorId}`)
  }
}
