import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SesionEntrenamiento } from '../class/sesion-entrenamiento';
import { Observable } from 'rxjs';
import { DetalleSesion } from '../class/detalle-sesion';

@Injectable({
  providedIn: 'root'
})
export class ServicioSesionEntrenamientoService {

  // private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/sesisonesEntrenamiento'
  
  constructor(private http: HttpClient) { }
  
  crearSesionEntrenamiento(sesionEntrenamiento: SesionEntrenamiento): Observable<SesionEntrenamiento>{
    return this.http.post<SesionEntrenamiento>(`${this.apiUrl}${this.endPoint}`,sesionEntrenamiento)
  }

  agregarEntrenamientosSesion(entrenamientosSesison: DetalleSesion[], idSesionEntrenamiento : number): Observable<DetalleSesion[]> {
    const body = {
      entrenamientos: entrenamientosSesison
    }
    return this.http.post<DetalleSesion[]>(`${this.apiUrl}${this.endPoint}/${idSesionEntrenamiento}/entrenamientos`,body)
  }
  
  obtenerSesionesEntrenamientoEquipo(id: number): Observable<SesionEntrenamiento[]>{
    return this.http.get<SesionEntrenamiento[]>(`${this.apiUrl}${this.endPoint}/equipo/${id}`)
  }

  obtenerEntrenamientosSesion(idSesion : number): Observable<SesionEntrenamiento>{
    return this.http.get<SesionEntrenamiento>(`${this.apiUrl}${this.endPoint}/${idSesion}/entrenamientos`)
  }
}
