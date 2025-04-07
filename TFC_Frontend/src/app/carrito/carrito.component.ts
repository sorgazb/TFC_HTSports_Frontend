import { Component, OnInit } from '@angular/core';
import { ServicioProductoService } from '../services/servicio-producto.service';
import { ServicioCarritoService } from '../services/servicio-carrito.service';
import { Router } from '@angular/router';
import { Carrito } from '../carrito';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  productosCarrito: Carrito[] = [];

  constructor(private router: Router, private serviciosProductos : ServicioProductoService, private servicioCarrito: ServicioCarritoService) { 

  }

  ngOnInit(): void {
    this.productosCarrito = this.servicioCarrito.obtenerCarrito();    
  }

  obtenerImporteTotal(): number {
    let total = 0;
    this.productosCarrito.forEach(item => {
      total += item.producto.precio * item.cantidad;
    });
    return total;
    console.log(this.productosCarrito)
  }

  eliminarProducto(productoId: number, talla: string): void {
    this.servicioCarrito.eliminarProducto(productoId, talla);
    this.productosCarrito = this.servicioCarrito.obtenerCarrito();
  }

}
