import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entrenamiento } from '../class/entrenamiento';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface CrearEntrenoPayload {
  tipo: string;
  descripcion: string;
  duracion: string;          // "HH:mm:00"
  id_cuerpo_tecnico: number;
}


@Injectable({
  providedIn: 'root'
})

export class ServicioEntrenamientoService {
  
  private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  //private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/entrenamientos'

  constructor(private http: HttpClient, private translate: TranslateService) { }
   
  crearEntrenamiento(body: CrearEntrenoPayload): Observable<Entrenamiento>{
    return this.http.post<Entrenamiento>(`${this.apiUrl}${this.endPoint}`,body)
  }
  
  obtenerEntrenamientoEquipo(id: number): Observable<Entrenamiento[]>{
    return this.http.get<Entrenamiento[]>(`${this.apiUrl}${this.endPoint}/equipo/${id}?lang=${this.translate.currentLang}`)
  }
 
  obtenerEntrenamiento(idEntrenamiento : number): Observable<Entrenamiento>{
    return this.http.get<Entrenamiento>(`${this.apiUrl}${this.endPoint}/${idEntrenamiento}`)
  }
}
