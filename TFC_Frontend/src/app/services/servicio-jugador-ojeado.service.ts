import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JugadorOjeado } from '../class/jugador-ojeado';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioJugadorOjeadoService {
  
  private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  //private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/jugadoresOjeados'

  constructor(private http: HttpClient) { }

  crearJugadorOjeado(jugadorOjeado: FormData): Observable<JugadorOjeado>{
    return this.http.post<JugadorOjeado>(`${this.apiUrl}${this.endPoint}`,jugadorOjeado)
  }

  obtenerJugadoresOjeadosEquipo(id: number): Observable<JugadorOjeado[]>{
    return this.http.get<JugadorOjeado[]>(`${this.apiUrl}${this.endPoint}/equipo/${id}`)
  }
}
