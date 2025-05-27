import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SesionEntrenamiento } from '../class/sesion-entrenamiento';
import { map, Observable } from 'rxjs';
import { DetalleSesion } from '../class/detalle-sesion';
import { Entrenamiento } from '../class/entrenamiento';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioSesionEntrenamientoService {

  private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  //private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/sesisonesEntrenamiento'
  
  constructor(private http: HttpClient, private translate: TranslateService) { }
  
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

  obtenerEntrenamientosSesion(idSesion: number): Observable<SesionEntrenamiento> {
    return this.http.get<any>(`${this.apiUrl}${this.endPoint}/${idSesion}/entrenamientos?lang=${this.translate.currentLang}`).pipe(
      map(respuesta => {
        const sesionMapeada = {
          ...respuesta,
          DetallesSesion: respuesta.DetallesSesion?.map((detalle: any) => {
            const fechaRaw = detalle.fecha ?? detalle.Fecha
            let fechaParseada = new Date(fechaRaw)
            if (isNaN(fechaParseada.getTime())) {
              fechaParseada = new Date()
            }
            const entRaw = detalle.entrenamiento ?? detalle.Entrenamiento ?? {}
            const descripcion = entRaw.descripcion ?? entRaw.Descripcion ?? 'Entrenamiento genérico'
            return {
              ...detalle,
              fecha: fechaParseada,
              entrenamiento: {
                ...entRaw,
                descripcion
              }
            }
          })
        }
        return sesionMapeada
      })
    )
  }
}
