import { Injectable } from '@angular/core';
import { Carrito } from '../class/carrito';
import { Producto } from '../class/producto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioCarritoService {

  private listadoCarrito: Carrito[] = [];
  private carritoSubject = new BehaviorSubject<Carrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor() {
    const data = localStorage.getItem('carrito');
    if (data) {
      this.listadoCarrito = JSON.parse(data);
      this.carritoSubject.next(this.listadoCarrito);
    }
  }

  private guardarEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.listadoCarrito));
  }

  obtenerCarrito() {
    return this.listadoCarrito;
  }

  agregarProducto(producto: Producto, cantidad: number, talla: string) {
    let productoExistente = this.listadoCarrito.find(item => item.producto.ID === producto.ID && item.talla === talla);
    if (productoExistente) {
      this.aumentarCantidad(this.listadoCarrito.indexOf(productoExistente), cantidad);
    } else {
      const carrito: Carrito = new Carrito();
      carrito.producto = producto;
      carrito.cantidad = cantidad;
      carrito.talla = talla;
      this.listadoCarrito.push(carrito);
    }
    this.carritoSubject.next(this.listadoCarrito);
    this.guardarEnLocalStorage();
  }

  aumentarCantidad(index: number, cantidad: number) {
    if (index >= 0 && index < this.listadoCarrito.length) {
      this.listadoCarrito[index].cantidad += cantidad;
      this.carritoSubject.next(this.listadoCarrito);
    }
  }

  eliminarProducto(productoId: number, talla: string): void {
    this.listadoCarrito = this.listadoCarrito.filter(item => item.producto.ID !== productoId || item.talla !== talla);
    this.carritoSubject.next(this.listadoCarrito);
    this.guardarEnLocalStorage();
  }

  limpiarCarrito(): void {
    this.listadoCarrito = [];
    this.carritoSubject.next([]);
    localStorage.removeItem('carrito');
  }
}
