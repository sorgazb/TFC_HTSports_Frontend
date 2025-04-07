import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Producto } from '../producto';

@Injectable({
  providedIn: 'root'
})

export class ServicioProductoService {

  private apiUrl = 'https://tfc-htsports-api-884687165526.europe-southwest1.run.app/'
  private endPoint = 'api/productos'

  constructor(private http : HttpClient,  private translate: TranslateService) { }

  obtenerTodosLosProductos():Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.apiUrl}${this.endPoint}?lang='${this.translate.currentLang}`)
  }

  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}${this.endPoint}/${id}?lang='${this.translate.currentLang}`)
  }
}
