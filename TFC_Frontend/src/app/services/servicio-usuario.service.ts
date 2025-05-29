import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Usuario } from '../class/usuario'
import { catchError, Observable, throwError } from 'rxjs'
import { Aficionado } from '../class/aficionado'
import { environment } from '../environments/environment'
import { CuerpoTecnico } from '../class/cuerpo-tecnico'
import { Jugador } from '../class/jugador'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})

export class ServicioUsuarioService {

  private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  //private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/usuarios'
  private faceInPhoto = 'https://faceinphoto.p.rapidapi.com/faceinphoto/count'

  constructor(private http: HttpClient, private translate : TranslateService) { 
  }

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}${this.endPoint}/registrar`, usuario).pipe(
      catchError((error : any) => {
        return throwError(() => error)
      })
    )
  }

  loguearUsuario(datosLogin: { correo_electronico: string, password: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}${this.endPoint}/login`, datosLogin).pipe(
      catchError((error : any) => {
        return throwError(() => error)
      })
    )
  }

  obtenerUsuario(correo_electronico: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}${this.endPoint}/usuario/${correo_electronico}`)
  }
  
  obtenerAficionado(id: number): Observable<Aficionado> {
    return this.http.get<Aficionado>(`${this.apiUrl}${this.endPoint}/aficionado/${id}`)
  }

  obtenerCuerpoTecnico(id: number): Observable<CuerpoTecnico>{
    return this.http.get<CuerpoTecnico>(`${this.apiUrl}${this.endPoint}/cuerpoTecnico/${id}`)
  }

  obtenerJugador(id: number): Observable<Jugador>{
    return this.http.get<Jugador>(`${this.apiUrl}${this.endPoint}/jugador/${id}`)
  }

  actualizarDatosUsuario(id: number, datos: FormData): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}${this.endPoint}/actualizar/${id}`, datos).pipe(
      catchError((error: any) => throwError(() => error))
    );
  }
  
  actualizarDatosAficionado(id:number,datosActualizar: { telefono: string, direccion: string, poblacion: string, codigo_postal: string }): Observable<Aficionado>{
    return this.http.put<Aficionado>(`${this.apiUrl}${this.endPoint}/aficionado/${id}/datos`, datosActualizar).pipe(
      catchError((error : any) => {
        return throwError(() => error)
      })
    )
  }

  obtenerJugadores(equipoId: number): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(`${this.apiUrl}${this.endPoint}/equipo/${equipoId}/jugadores?lang=${this.translate.currentLang}`)
  }

  obtenerJugadoresAlineacion(equipoId: number): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(`${this.apiUrl}${this.endPoint}/equipo/alineacion/${equipoId}?lang=${this.translate.currentLang}`)
  }

  obtenerCuerposTecnicos(equipoId: number): Observable<CuerpoTecnico[]> {
    return this.http.get<CuerpoTecnico[]>(`${this.apiUrl}${this.endPoint}/equipo/${equipoId}/cuerpotecnico?lang=${this.translate.currentLang}`)
  }

  obtenerJugadorPlantilla(jugadorId: number): Observable<Jugador>{
    return this.http.get<Jugador>(`${this.apiUrl}${this.endPoint}/equipo/jugadores/${jugadorId}?lang=${this.translate.currentLang}`)
  }

    obtenerCuerpoTecnicoPlantilla(cuerpoTecnicoId: number): Observable<CuerpoTecnico>{
    return this.http.get<CuerpoTecnico>(`${this.apiUrl}${this.endPoint}/equipo/cuerpotecnico/${cuerpoTecnicoId}?lang=${this.translate.currentLang}`)
  }

  comprobarImagenWEB(imagen: File): Observable<any> {
    const headers = new HttpHeaders({
      'X-Rapidapi-Key': environment.RAPIDAPI_KEY,
      'X-Rapidapi-Host': 'faceinphoto.p.rapidapi.com'
    })

    const formData = new FormData()
    formData.append('image', imagen, imagen.name)

    return this.http.post<any>(this.faceInPhoto, formData, { headers }).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

}