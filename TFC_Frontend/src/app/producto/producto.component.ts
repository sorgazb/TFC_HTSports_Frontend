import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServicioProductoService } from '../services/servicio-producto.service';
import { Producto } from '../producto';
import { ServicioCarritoService } from '../services/servicio-carrito.service';
import { PasarelaPagoComponent } from '../pasarela-pago/pasarela-pago.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit{

  translate !: TranslateService;

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

  id !: number 

  cantidad : number  = 1;

  tallaSeleccionada: string = '';

  mostrarErrorTalla : boolean = false

  mostrarProductoEnCesta : boolean = false

  esRopa : boolean = true

    constructor(translate: TranslateService, private router: Router, private serviciosProductos : ServicioProductoService, private servicioCarrito: ServicioCarritoService) {
        this.translate = translate;
    }

    ngOnInit(): void {
      this.id = Number(this.router.url.split('/').pop());
      this.serviciosProductos.obtenerProductoPorId(this.id).subscribe((producto: Producto) => {
        this.producto.ID = producto.ID;
        this.producto.nombre = producto.nombre;
        this.producto.descripcion = producto.descripcion;
        this.producto.precio = producto.precio;
        this.producto.imagen = producto.imagen;
        this.producto.stock = producto.stock;
        this.producto.tipo = producto.tipo;
        this.producto.id_equipo = producto.id_equipo;
        if(producto.tipo == "ropa"){
          this.esRopa = true
        }else{
          this.esRopa = false
        }
      });
    }

    agregarProducto(producto: Producto) {
      if(this.tallaSeleccionada === '' && this.producto.tipo === 'ropa') {
        this.mostrarErrorTalla = true;
      }else{
        this.servicioCarrito.agregarProducto(this.producto, this.cantidad, this.tallaSeleccionada);
        this.mostrarProductoEnCesta = true
      }
    }

    pagarProducto(producto: Producto){
      if(this.tallaSeleccionada === '' && this.producto.tipo === 'ropa') {
        this.mostrarErrorTalla = true;
      }else{
        this.servicioCarrito.agregarProducto(this.producto, this.cantidad, this.tallaSeleccionada);
        this.router.navigate(['/carrito'])
      }
    }

    seleccionarTalla(talla: string) {
      this.tallaSeleccionada = talla; 
      this.cerrarAlerta()
    }

    cerrarAlerta (){
      this.mostrarProductoEnCesta = false
      this.mostrarErrorTalla = false
    }

}
