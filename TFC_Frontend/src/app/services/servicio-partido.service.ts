import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Partido } from '../class/partido';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioPartidoService {

  //private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/partidos'
  
  constructor(private http : HttpClient, private translate: TranslateService) { }
  
  obtenerPartidos():Observable<Partido[]>{
    return this.http.get<Partido[]>(`${this.apiUrl}${this.endPoint}?lang=${this.translate.currentLang}`)
  }

  obtenerPartido(id: number):Observable<Partido>{
    return this.http.get<Partido>(`${this.apiUrl}${this.endPoint}/${id}?lang=${this.translate.currentLang}`)
  }

  finalizarPartido(id: number):Observable<any>{
    return this.http.put(`${this.apiUrl}${this.endPoint}/${id}/finalizar`, {})
  }

  jugarPartido(id: number):Observable<any>{
    return this.http.put(`${this.apiUrl}${this.endPoint}/${id}/jugar`, {})
  }

  obtenerPartidosEquipo(id: number):Observable<Partido[]>{
    return this.http.get<Partido[]>(`${this.apiUrl}${this.endPoint}/equipos/${id}?lang=${this.translate.currentLang}`)
  }

  actualizarAlineacionEquipo(idPartido: number, idEquipo: number, idAlineacion: number): Observable<any> {
    const nuevaAlineacion = { alineacion_id: idAlineacion };
    return this.http.put(`${this.apiUrl}${this.endPoint}/${idPartido}/equipos/${idEquipo}`,nuevaAlineacion)
  }
}
