import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../pedido';
import { Observable } from 'rxjs';
import { DetallePedido } from '../detalle-pedido';
import { pt_BR } from 'ng-zorro-antd/i18n';

@Injectable({
  providedIn: 'root'
})
export class ServicioPedidoService {

  constructor(private http : HttpClient) { }

      // Método para registrar un usuario
      crearPedido(pedido: Pedido): Observable<Pedido> {
        return this.http.post<Pedido>('https://tfc-htsports-api-884687165526.europe-southwest1.run.app/api/pedidos', pedido);
      }

      agregarProductosPedido(productosPedido: DetallePedido[], idPedido : number): Observable<DetallePedido[]> {
        const body = {
          productos: productosPedido
        };
        return this.http.post<DetallePedido[]>('https://tfc-htsports-api-884687165526.europe-southwest1.run.app/api/pedidos/' + idPedido + '/productos', body);
      }
      
      pagarPedido(idPedido: number): Observable<any> {
        return this.http.put(`https://tfc-htsports-api-884687165526.europe-southwest1.run.app/api/pedidos/${idPedido}/pagado`, {});
      }
      
      cancelarPedido(idPedido: number): Observable<any> {
        return this.http.put(`https://tfc-htsports-api-884687165526.europe-southwest1.run.app/api/pedidos/${idPedido}/cancelado`, {});
      }

      obtenerPedidosAficionado(idAficionado: number): Observable<Pedido[]>{
        return this.http.get<Pedido[]>(`https://tfc-htsports-api-884687165526.europe-southwest1.run.app/api/pedidos/aficionados/${idAficionado}/pedidos`)
      }
}
