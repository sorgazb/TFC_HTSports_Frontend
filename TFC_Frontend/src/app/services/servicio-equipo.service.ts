import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../class/equipo';

@Injectable({
  providedIn: 'root'
})

export class ServicioEquipoService {

  private apiUrl = 'https://tfc-htsports-api-884687165526.europe-southwest1.run.app/'
  private endPoint = 'api/equipos'

  constructor(private http : HttpClient) { }

  obtenerTodosLosEquipos():Observable<Equipo[]>{
    return this.http.get<Equipo[]>(`${this.apiUrl}${this.endPoint}`)
  }
}
