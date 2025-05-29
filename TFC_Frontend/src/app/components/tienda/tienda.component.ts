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

  productos: Producto[] = []
  equipos: Equipo[] = []
  productosPaginados: Producto[] = []

  translate!: TranslateService

  mostrarTienda: boolean = true
  mostrarFiltros: boolean = false
  
  filtroTipoProducto !: string
  filtroEquipo !: number
  filtroPrecioMin !: number
  filtroPrecioMax !: number
  ordenPrecio !: string

  productosPagina : number = 12
  paginaActual : number = 1
  totalPaginas !: number

  cargando : boolean = true

  constructor(translate : TranslateService, private router : Router, private serviciosProductos : ServicioProductoService, private serviciosEquipo : ServicioEquipoService) {
    this.translate = translate
  }

  ngOnInit(): void {
    
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }

    if(!localStorage.getItem('aficionado')){
      this.router.navigate(['/error'])
    }

    this.serviciosProductos.obtenerTodosLosProductos().subscribe((productos: Producto[]) => {
      this.productos = productos
      this.totalPaginas = Math.ceil(this.productos.length / this.productosPagina)
      this.actualizarProductosPaginados()
      this.cargando = false
    })
    this.serviciosEquipo.obtenerTodosLosEquipos().subscribe((equipos: Equipo[]) => {
      this.equipos = equipos
    })
  }
  
  /*
  * Metodo que renderiza los productos de la pagina en la que se encuentra el
  * usuario.
  */
  actualizarProductosPaginados(){
    const inicio = (this.paginaActual - 1) * this.productosPagina
    const fin = inicio + this.productosPagina
    this.productosPaginados = this.productos.slice(inicio, fin)
  }

  /*
  * Metodo que actualiza la pagina a la que quiere dirigirse el usuario.
  * @param {number} => pagina a la que se quiere dirigir el usario.
  */
  cambiarPagina(pagina: number){
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina
      this.actualizarProductosPaginados()
    }
  }

  /*
  * Metodo que redirige al usuario a la pagina del producto que ha seleccionado.
  * @param {number} => id del producto seleccionado.
  */
  comprarProducto(id: number) {
    this.router.navigate(['/producto', id])
  }

  /*
  * Metodo que aplica los filtros establecidos por el usuario a la hora de
  * mostrar los productos.
  */
  aplicarFiltros() {
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
