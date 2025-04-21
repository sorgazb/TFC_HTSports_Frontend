import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Entrada } from '../class/entrada';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioEntradaService {

    // private apiUrl = 'https://tfc-htsports-api-884687165526.europe-southwest1.run.app/'
    private apiUrl = 'http://localhost:8080/'
    private endPoint = 'api/entradas'

  constructor(private http : HttpClient, private translate: TranslateService) { }

    crearEntrada(entrada: Entrada): Observable<Entrada> {
      return this.http.post<Entrada>(`${this.apiUrl}${this.endPoint}`, entrada)
    }
        
    pagarEntrada(idEntrada: number): Observable<any> {
      return this.http.put(`${this.apiUrl}${this.endPoint}/${idEntrada}/pagar`, {})
    }
        
    cancelarEntrada(idEntrada: number): Observable<any> {
      return this.http.put(`${this.apiUrl}${this.endPoint}/${idEntrada}/cancelar`, {})
    }

    usarEntrada(idEntrada: number): Observable<any> {
      return this.http.put(`${this.apiUrl}${this.endPoint}/${idEntrada}/usar`, {})
    }
  
    obtenerEntradasAficionado(idAficionado: number): Observable<Entrada[]>{
      return this.http.get<Entrada[]>(`${this.apiUrl}${this.endPoint}/aficionado/${idAficionado}?lang=${this.translate.currentLang}`)
    }
  
    obtenerEntrada(idEntrada: number): Observable<Entrada>{
      return this.http.get<Entrada>(`${this.apiUrl}${this.endPoint}/${idEntrada}`)
    }
}
