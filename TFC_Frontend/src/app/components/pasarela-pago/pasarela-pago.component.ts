import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Carrito } from '../../class/carrito';
import { ServicioCarritoService } from '../../services/servicio-carrito.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioPedidoService } from '../../services/servicio-pedido.service';
import { Pedido } from '../../class/pedido';
import { DetallePedido } from '../../class/detalle-pedido';
import { Router } from '@angular/router';
import { Aficionado } from '../../class/aficionado';
import { TranslateService } from '@ngx-translate/core';

declare var paypal: any;

@Component({
  selector: 'app-pasarela-pago',
  templateUrl: './pasarela-pago.component.html',
  styleUrls: ['./pasarela-pago.component.css']
})

export class PasarelaPagoComponent implements OnInit {

  @ViewChild('paypal', { static: false }) paypalElement!: ElementRef

  listadoCarrito!: Carrito[]
  aficionado !:Aficionado

  formNuevaDireccion!: FormGroup

  total: number = 0
  usarDireccionGuardada: boolean = false
  pedidoIDCreado!: number
  
  alerta = {
    mostrar: false,
    mensaje: '',
  }

  constructor(private serviciosCarrito: ServicioCarritoService, private servicioPedido: ServicioPedidoService, private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {
    
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }

    if(!localStorage.getItem('aficionado')){
      this.router.navigate(['/error'])
    }

    this.aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}');
    this.formNuevaDireccion = new FormGroup({
      direccion : new FormControl('', [Validators.required]),
      poblacion : new FormControl('', [Validators.required]),
      codigoPostal : new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]+$')])
    })

    this.listadoCarrito = this.serviciosCarrito.obtenerCarrito();
    this.total = this.listadoCarrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
  }

  /*
  * Metodo que comprueba si el input contiene algun error.
  * @param {string} => nombre del input a controlar.
  * @param {string} => nombre del error controlado.
  * @return {FormGroup.control} =>  devuelve si se comple un error.
  */
  public controlarErroresAficionado(nombreControl : string, nombreError : string){
    return this.formNuevaDireccion.controls[nombreControl].hasError(nombreError)
  }

  /*
  * Metodo que activa o desactiva el formulario para crear una nueva direccion o no.
  */
  seleccionarDireccion() {
    if(this.usarDireccionGuardada == true){
      this.formNuevaDireccion.disable()
    }else{
      this.formNuevaDireccion.enable()
    }
  }

  /*
  * Metodo que procede a llamar al servicio para crear un nuevo pedido incluyendo
  * en los detalles de ese pedido los productos correspondientes y haciendo la 
  * llamada al metodo para proceder con el pago.
  */ 
  crearPedido() {
    const carrito = this.serviciosCarrito.obtenerCarrito()

    const productosCarrito: DetallePedido[] = carrito.map(productoCarrito => ({
      ID: 0,
      id_Pedido: 0,
      id_Producto: productoCarrito.producto.ID,
      cantidad: productoCarrito.cantidad,
      precio: productoCarrito.producto.precio
    }))

    const pedido = new Pedido();

    if(this.usarDireccionGuardada == true){
      pedido.id_aficionado = this.aficionado.ID
      pedido.direccion = this.aficionado.direccion
      pedido.poblacion = this.aficionado.poblacion
      pedido.codigo_postal = this.aficionado.codigo_postal
    }else{
      if (this.aficionado) {
        pedido.id_aficionado = this.aficionado.ID;
        pedido.direccion = this.formNuevaDireccion.get('direccion')?.value
        pedido.poblacion = this.formNuevaDireccion.get('poblacion')?.value
        pedido.codigo_postal = this.formNuevaDireccion.get('codigoPostal')?.value
      }
    }

    this.servicioPedido.crearPedido(pedido).subscribe((pedidoCreado: Pedido) => {
      this.pedidoIDCreado = pedidoCreado.ID
      this.servicioPedido.agregarProductosPedido(productosCarrito, pedidoCreado.ID).subscribe((detalles: DetallePedido[]) => {
        this.pasarelaPaypal()
      });
    });
  }

  /*
  * Metodo que hace la llamada a la API Paypal Developers,
  * la cual permite realizar pagos reales en la web.
  */ 
  pasarelaPaypal() {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: 'Compra en Mi Tienda',
              amount: {
                currency_code: 'EUR',
                value: this.total.toFixed(2)
              }
            }]
          })
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture()
          this.servicioPedido.pagarPedido(this.pedidoIDCreado).subscribe(() => {
            this.serviciosCarrito.limpiarCarrito()
            if(this.translate.currentLang == 'es'){
              this.mostrarAlerta('Pago aprobado. ¡Gracias por tu compra!')
            }
            if(this.translate.currentLang == 'gb'){
              this.mostrarAlerta('Payment approved. Thank you for your purchase!')
            }
          })
        },
        onError: (err: any) => {
          this.servicioPedido.cancelarPedido(this.pedidoIDCreado).subscribe(() => {
          })
          if(this.translate.currentLang == 'es'){
            this.mostrarAlerta('Ocurrió un error al procesar el pago')
          }
          if(this.translate.currentLang == 'gb'){
            this.mostrarAlerta('An error occurred while processing the payment. Please try again.')
          }
        }
      }).render(this.paypalElement.nativeElement)
  }

  /*
  * Metodo para mostrar una alerta con el resultado del pago. Una vez transcurridos 5 segundos
  * redirige al usario a la pagina principal.
  * @param {string} => Contenido del mensaje de la alerta.
  */
  mostrarAlerta(mensaje: string) {
    this.alerta.mensaje = mensaje
    this.alerta.mostrar = true
    
    setTimeout(() => {
      this.router.navigate(['/'])
    }, 5000)
  }
}
