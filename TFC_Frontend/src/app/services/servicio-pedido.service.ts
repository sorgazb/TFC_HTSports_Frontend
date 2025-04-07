import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../pedido';
import { Observable } from 'rxjs';
import { DetallePedido } from '../detalle-pedido';

@Injectable({
  providedIn: 'root'
})

export class ServicioPedidoService {

  private apiUrl = 'https://tfc-htsports-api-884687165526.europe-southwest1.run.app/'
  private endPoint = 'api/pedidos'

  constructor(private http : HttpClient) { }

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
    return this.http.get<Pedido[]>(`${this.apiUrl}${this.endPoint}/aficionados/${idAficionado}/pedidos`)
  }

  obtenerPedido(idPedido: number): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(`${this.apiUrl}${this.endPoint}/${idPedido}`)
  }
}
