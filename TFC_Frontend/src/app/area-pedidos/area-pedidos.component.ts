import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServicioPedidoService } from '../services/servicio-pedido.service';
import { Pedido } from '../pedido';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-area-pedidos',
  templateUrl: './area-pedidos.component.html',
  styleUrls: ['./area-pedidos.component.css']
})
export class AreaPedidosComponent implements AfterViewInit, OnInit{

  displayedColumns: string[] = ['ID', 'direccion', 'poblacion', 'codigo_postal', 'estado', 'precio_total'];
  dataSource = new MatTableDataSource<Pedido>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


constructor(private serviciosPedidos : ServicioPedidoService){}

  ngOnInit(): void {
    const aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}');

    this.serviciosPedidos.obtenerPedidosAficionado(aficionado.ID).subscribe((pedidos: Pedido[]) => {
      this.dataSource.data = pedidos
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

