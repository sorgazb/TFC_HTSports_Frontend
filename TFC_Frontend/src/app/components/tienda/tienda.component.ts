import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Producto } from '../../class/producto';
import { ServicioProductoService } from '../../services/servicio-producto.service';
import { Equipo } from '../../class/equipo';
import { ServicioEquipoService } from '../../services/servicio-equipo.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})

export class TiendaComponent implements OnInit {

  translate!: TranslateService

  mostrarTienda: boolean = true

  productos: Producto[] = []
  
  equipos: Equipo[] = []
  
  mostrarFiltros: boolean = false
  
  filtroTipoProducto !: string
  filtroEquipo !: number
  filtroPrecioMin !: number
  filtroPrecioMax !: number
  ordenPrecio !: string

  productosPaginados: Producto[] = []
  productosPagina : number = 8
  paginaActual : number = 1
  totalPaginas !: number

  constructor(translate : TranslateService, private router : Router, private serviciosProductos : ServicioProductoService, private serviciosEquipo : ServicioEquipoService) {
    this.translate = translate
  }

  ngOnInit(): void {
    this.serviciosProductos.obtenerTodosLosProductos().subscribe((productos: Producto[]) => {
      this.productos = productos
      this.totalPaginas = Math.ceil(this.productos.length / this.productosPagina)
      this.actualizarProductosPaginados()
    });
    this.serviciosEquipo.obtenerTodosLosEquipos().subscribe((equipos: Equipo[]) => {
      this.equipos = equipos
    });
  }

  actualizarProductosPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.productosPagina
    const fin = inicio + this.productosPagina
    this.productosPaginados = this.productos.slice(inicio, fin)
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina
      this.actualizarProductosPaginados()
    }
  }

  comprarProducto(id: number): void {
    this.router.navigate(['/producto', id])
  }

  aplicarFiltros(): void {
    let productosFiltrados = this.productos

    if (this.filtroTipoProducto) {
      productosFiltrados = productosFiltrados.filter(p => p.tipo == this.filtroTipoProducto)
    }

    if (this.filtroEquipo) {
      productosFiltrados = productosFiltrados.filter(p => p.id_equipo == this.filtroEquipo)
    }

    if (this.filtroPrecioMin != null) {
      productosFiltrados = productosFiltrados.filter(p => p.precio >= this.filtroPrecioMin!)
    }

    if (this.filtroPrecioMax != null) {
      productosFiltrados = productosFiltrados.filter(p => p.precio <= this.filtroPrecioMax!)
    }

    if (this.ordenPrecio === 'asc') {
      productosFiltrados = productosFiltrados.sort((a, b) => a.precio - b.precio)
    } else if (this.ordenPrecio === 'desc') {
      productosFiltrados = productosFiltrados.sort((a, b) => b.precio - a.precio)
    }

    this.totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / this.productosPagina))
    this.paginaActual = 1;
    this.productosPaginados = productosFiltrados.slice(0, this.productosPagina)
  }
}
