import { HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Usuario } from '../usuario'
import { Observable } from 'rxjs'
import { Aficionado } from '../aficionado'

@Injectable({
  providedIn: 'root'
})

export class ServicioUsuarioService {

  private apiUrl = 'https://tfc-htsports-api-884687165526.europe-southwest1.run.app/'
  private endPoint = 'api/usuarios'

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}${this.endPoint}/registrar`, usuario);
  }

  loguearUsuario(datosLogin: { correo_electronico: string, password: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}${this.endPoint}/login`, datosLogin);
  }
  

  obtenerAficionado(id: number): Observable<Aficionado> {
    return this.http.get<Aficionado>(`${this.apiUrl}${this.endPoint}/aficionado/${id}`);
  }

  obtenerUsuario(correo_electronico: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}${this.endPoint}/usuario/${correo_electronico}`);
  }
}
