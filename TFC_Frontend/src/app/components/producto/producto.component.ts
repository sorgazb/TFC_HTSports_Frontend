import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServicioProductoService } from '../../services/servicio-producto.service';
import { Producto } from '../../class/producto';
import { ServicioCarritoService } from '../../services/servicio-carrito.service';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})

export class ProductoComponent implements OnInit{
  producto : Producto = {
    ID: 0,
    nombre: "",
    descripcion: "",
    precio: 0,
    imagen: "",
    stock: 0,
    tipo: "",
    id_equipo: 0
  }

  translate !: TranslateService
  
  cantidad : number  = 1
  tallaSeleccionada : string = ''
  esRopa : boolean = true

  mostrarErrorTalla : boolean = false
  mostrarProductoEnCesta : boolean = false
  
  constructor(translate: TranslateService, private router: Router, private serviciosProductos : ServicioProductoService, private servicioCarrito: ServicioCarritoService) {
    this.translate = translate
  }

  ngOnInit(): void {
    
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }

    if(!localStorage.getItem('aficionado')){
      this.router.navigate(['/error'])
    }

    this.serviciosProductos.obtenerProductoPorId(Number(this.router.url.split('/').pop())).subscribe((producto: Producto) => {
      this.producto.ID = producto.ID
      this.producto.nombre = producto.nombre
      this.producto.descripcion = producto.descripcion
      this.producto.precio = producto.precio
      this.producto.imagen = producto.imagen
      this.producto.stock = producto.stock
      this.producto.tipo = producto.tipo
      this.producto.id_equipo = producto.id_equipo
      
      if(producto.tipo == "ropa"){
        this.esRopa = true
      }else{
          this.esRopa = false
      }
    })
  }

  /*
  * Metodo que agrega el producto a la cesta, en caso de error muestra un alert.
  * @param {Producto} => producto que se va a añadir al carrito.
  */
  agregarProducto(producto: Producto) {
    if(this.tallaSeleccionada === '' && this.producto.tipo === 'ropa') {
      this.mostrarErrorTalla = true
    }else{
      this.servicioCarrito.agregarProducto(this.producto, this.cantidad, this.tallaSeleccionada);
      this.mostrarProductoEnCesta = true
    }
  }

  /*
  * Metodo que agrega el producto a la cesta, en caso de error muestra un alert, y 
  * redirige al usuario directamente al carrito.
  * @param {Producto} => producto que se va a comprar.
  */
  pagarProducto(producto: Producto){
    if(this.tallaSeleccionada === '' && this.producto.tipo === 'ropa') {
      this.mostrarErrorTalla = true
    }else{
      this.servicioCarrito.agregarProducto(this.producto, this.cantidad, this.tallaSeleccionada);
      this.router.navigate(['/carrito'])
    }
  }

  /*
  * Metodo que asigna la talla del producto que se va a comprar.
  * @param {string} => Talla del producto seleccionado para su compra.
  */ 
  seleccionarTalla(talla: string) {
    this.tallaSeleccionada = talla
  }

  /*
  * Metodo para cerrar las alertas que aparecen en la ejecucion.
  */
  cerrarAlerta (){
    this.mostrarProductoEnCesta = false
    this.mostrarErrorTalla = false
  }
}
