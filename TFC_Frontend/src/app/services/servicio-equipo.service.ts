import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../class/equipo';

@Injectable({
  providedIn: 'root'
})

export class ServicioEquipoService {

  private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  //private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/equipos'

  constructor(private http : HttpClient) { }

  obtenerTodosLosEquipos():Observable<Equipo[]>{
    return this.http.get<Equipo[]>(`${this.apiUrl}${this.endPoint}`)
  }

  obtenerEquipoPorId(id : number):Observable<Equipo>{
    return this.http.get<Equipo>(`${this.apiUrl}${this.endPoint}/${id}`)
  }
}
