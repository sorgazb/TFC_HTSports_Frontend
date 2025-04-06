import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Producto } from '../producto';
import { Equipo } from '../equipo';

@Injectable({
  providedIn: 'root'
})
export class ServicioEquipoService {

  constructor(private http : HttpClient,  private translate: TranslateService) { }

  obtenerTodosLosEquipos():Observable<Equipo[]>{
    return this.http.get<Equipo[]>('https://tfc-htsports-api-884687165526.europe-southwest1.run.app/api/equipos')
  }
}
