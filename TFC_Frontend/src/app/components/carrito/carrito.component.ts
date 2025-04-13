import { Component, OnInit } from '@angular/core';
import { ServicioProductoService } from '../../services/servicio-producto.service';
import { ServicioCarritoService } from '../../services/servicio-carrito.service';
import { Router } from '@angular/router';
import { Carrito } from '../../class/carrito';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  productosCarrito: Carrito[] = []

  constructor(private router: Router, private serviciosProductos : ServicioProductoService, private servicioCarrito: ServicioCarritoService) { }

  ngOnInit(): void {
    this.productosCarrito = this.servicioCarrito.obtenerCarrito()
  }

  /*
  * Metodo que calcula el importe total del carrito.
  * @return {number} => devuelve el importe total.
  */
  obtenerImporteTotal(){
    let total = 0
    this.productosCarrito.forEach(item => {
      total += item.producto.precio * item.cantidad
    })
    return total
  }

  /*
  * Metodo que elimina un producto del carro y actualiza su contenido.
  * @param {number} => id del producto a eliminar.
  * @param {string} => talla para poder identificar mejor el producto a eliminar.
  */ 
  eliminarProducto(productoId: number, talla: string){
    this.servicioCarrito.eliminarProducto(productoId, talla)
    this.productosCarrito = this.servicioCarrito.obtenerCarrito()
  }

}
