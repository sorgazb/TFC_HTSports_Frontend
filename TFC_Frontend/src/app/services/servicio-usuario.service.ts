import { HttpClient, HttpHeaders} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Usuario } from '../usuario'
import { catchError, Observable, throwError } from 'rxjs'
import { Aficionado } from '../aficionado'

@Injectable({
  providedIn: 'root'
})

export class ServicioUsuarioService {

  private apiUrl = 'https://tfc-htsports-api-884687165526.europe-southwest1.run.app/'
  private endPoint = 'api/usuarios'

  constructor(private http: HttpClient) { }

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
  
  obtenerAficionado(id: number): Observable<Aficionado> {
    return this.http.get<Aficionado>(`${this.apiUrl}${this.endPoint}/aficionado/${id}`)
  }

  obtenerUsuario(correo_electronico: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}${this.endPoint}/usuario/${correo_electronico}`)
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

  private baseUrl = 'https://faceinphoto.p.rapidapi.com/faceinphoto/count';

  private headers = new HttpHeaders({
    'x-rapidapi-host': 'faceinphoto.p.rapidapi.com',
    'x-rapidapi-key': '537517a32emsh5c0948f57af5a91p182ba2jsn0448a4034897',
  });

    comprobarImagen(image: File): Observable<any> {
      const formData = new FormData();
      formData.append('image', image);
  
      return this.http.post<any>(this.baseUrl, formData, { headers: this.headers });
    }
}
