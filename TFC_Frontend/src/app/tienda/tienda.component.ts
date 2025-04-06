import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Producto } from '../producto';
import { ServicioProductoService } from '../services/servicio-producto.service';
import { Equipo } from '../equipo';
import { ServicioEquipoService } from '../services/servicio-equipo.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {

  translate!: TranslateService;

  mostrarTienda: boolean = true;

  productos: Producto[] = [];
  productosPaginados: Producto[] = [];
  filtroTipoProducto: string = '';
  
  filtroEquipo: number = 0;
  equipos: Equipo[] = [];

  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;

  ordenPrecio: string = '';

  pageSize: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;

  mostrarFiltros: boolean = false;

  constructor(
    translate: TranslateService, 
    private router: Router, 
    private serviciosProductos: ServicioProductoService,
    private serviciosEquipo: ServicioEquipoService
  ) {
    this.translate = translate;
  }

  ngOnInit(): void {
    this.serviciosProductos.obtenerTodosLosProductos().subscribe((productos: Producto[]) => {
      this.productos = productos;
      this.aplicarFiltros();
      this.totalPages = Math.ceil(this.productos.length / this.pageSize);
      this.actualizarProductosPaginados();
    });
    this.serviciosEquipo.obtenerTodosLosEquipos().subscribe((equipos: Equipo[]) => {
      this.equipos = equipos;
    });
  }

  actualizarProductosPaginados(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.productosPaginados = this.productos.slice(start, end);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.currentPage = nuevaPagina;
      this.actualizarProductosPaginados();
    }
  }

  comprarProducto(id: number): void {
    console.log("Comprar producto con ID: " + id);
    this.router.navigate(['/producto', id]);
  }

  aplicarFiltros(): void {
    let productosFiltrados = this.productos;
  
    // Filtro por tipo de producto
    if (this.filtroTipoProducto) {
      productosFiltrados = productosFiltrados.filter(p => p.tipo === this.filtroTipoProducto);
    }
  
    // Filtro por equipo
    if (this.filtroEquipo) {
      productosFiltrados = productosFiltrados.filter(p => p.id_equipo == this.filtroEquipo);
    }
  
    // Filtro por precio mínimo
    if (this.filtroPrecioMin != null) {
      productosFiltrados = productosFiltrados.filter(p => p.precio >= this.filtroPrecioMin!);
    }
  
    // Filtro por precio máximo
    if (this.filtroPrecioMax != null) {
      productosFiltrados = productosFiltrados.filter(p => p.precio <= this.filtroPrecioMax!);
    }
  
    // Ordenar por precio
    if (this.ordenPrecio === 'asc') {
      productosFiltrados = productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (this.ordenPrecio === 'desc') {
      productosFiltrados = productosFiltrados.sort((a, b) => b.precio - a.precio);
    }
  
    // Actualización de la paginación
    this.totalPages = Math.max(1, Math.ceil(productosFiltrados.length / this.pageSize));
    this.currentPage = 1;
    this.productosPaginados = productosFiltrados.slice(0, this.pageSize);
  }
  
  
  
}
