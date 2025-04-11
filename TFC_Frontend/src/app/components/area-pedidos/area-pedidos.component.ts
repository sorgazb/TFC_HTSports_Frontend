import { Component, OnInit } from '@angular/core';
import { ServicioPedidoService } from '../../services/servicio-pedido.service';
import { Pedido } from '../../class/pedido';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-area-pedidos',
  templateUrl: './area-pedidos.component.html',
  styleUrls: ['./area-pedidos.component.css']
})
export class AreaPedidosComponent implements OnInit {

  pedidos: Pedido[] = [];

  constructor(private serviciosPedidos: ServicioPedidoService) { }

  ngOnInit(): void {
    const aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}');

    this.serviciosPedidos.obtenerPedidosAficionado(aficionado.ID).subscribe((pedidos: Pedido[]) => {
      this.pedidos = pedidos.sort((a, b) => b.ID - a.ID);
      this.pedidos = pedidos;

      const tiempoCancelacion = 24 * 60 * 60 * 1000;
      const fechaCancelacion = Date.now() - tiempoCancelacion;

      this.pedidos.forEach(pedido => {
        if (pedido.fecha.getTime() < fechaCancelacion && pedido.estado === 'pendiente') {
          this.serviciosPedidos.cancelarPedido(pedido.ID).subscribe(() => {
          });
        }
      });
    });
  }
}
