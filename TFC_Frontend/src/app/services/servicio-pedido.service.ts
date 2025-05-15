import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../class/pedido';
import { Observable } from 'rxjs';
import { DetallePedido } from '../class/detalle-pedido';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class ServicioPedidoService {

  private apiUrl = 'https://tfc-htsports-api-439566681458.europe-southwest1.run.app/'
  // private apiUrl = 'http://localhost:8080/'
  private endPoint = 'api/pedidos'

  constructor(private http : HttpClient, private translate: TranslateService) { }

  crearPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}${this.endPoint}`, pedido)
  }
  
  agregarProductosPedido(productosPedido: DetallePedido[], idPedido : number): Observable<DetallePedido[]> {
    const body = {
      productos: productosPedido
    }
    return this.http.post<DetallePedido[]>(`${this.apiUrl}${this.endPoint}/${idPedido}/productos`,body)
  }
      
  pagarPedido(idPedido: number): Observable<any> {
    return this.http.put(`${this.apiUrl}${this.endPoint}/${idPedido}/pagado`, {})
  }
      
  cancelarPedido(idPedido: number): Observable<any> {
    return this.http.put(`${this.apiUrl}${this.endPoint}/${idPedido}/cancelado`, {})
  }

  obtenerPedidosAficionado(idAficionado: number): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(`${this.apiUrl}${this.endPoint}/aficionados/${idAficionado}/pedidos?lang=${this.translate.currentLang}`)
  }

  obtenerPedido(idPedido: number): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(`${this.apiUrl}${this.endPoint}/${idPedido}`)
  }
}
