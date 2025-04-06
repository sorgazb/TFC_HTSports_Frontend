import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Carrito } from '../carrito';
import { ServicioCarritoService } from '../services/servicio-carrito.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioPedidoService } from '../services/servicio-pedido.service';
import { Pedido } from '../pedido';
import { DetallePedido } from '../detalle-pedido';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

declare var paypal: any;

@Component({
  selector: 'app-pasarela-pago',
  templateUrl: './pasarela-pago.component.html',
  styleUrls: ['./pasarela-pago.component.css']
})

export class PasarelaPagoComponent implements OnInit {

  @ViewChild('paypal', { static: false }) paypalElement!: ElementRef;

  listadoCarrito!: Carrito[];
  total: number = 0;
  formRegistro!: FormGroup;
  usarDireccionGuardada: boolean = false;
  pedidoIDCreado!: number;

  alerta = {
    mostrar: false,
    mensaje: '',
  };

  constructor(
    private serviciosCarrito: ServicioCarritoService,
    private servicioPedido: ServicioPedidoService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    // Inicializar formulario
    this.formRegistro = new FormGroup({
      direccion: new FormControl('', Validators.required),
      poblacion: new FormControl('', Validators.required),
      codigoPostal: new FormControl('', Validators.required)
    });

    // Obtener carrito y calcular total
    this.listadoCarrito = this.serviciosCarrito.obtenerCarrito();
    this.total = this.listadoCarrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);

    console.log(this.listadoCarrito);
    console.log(this.total);

    // No renderizamos PayPal aquí
  }

  onDireccionSeleccionada() {
    this.usarDireccionGuardada ? this.formRegistro.disable() : this.formRegistro.enable();
  }

  crearPedido() {
    const carrito = this.serviciosCarrito.obtenerCarrito();

    const productosCarrito: DetallePedido[] = carrito.map(productoCarrito => ({
      ID: 0,
      id_Pedido: 0,
      id_Producto: productoCarrito.producto.ID,
      cantidad: productoCarrito.cantidad,
      precio: productoCarrito.producto.precio
    }));

    const pedido = new Pedido();
    const aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}');

    if (aficionado) {
      pedido.id_aficionado = aficionado.ID;
      pedido.direccion = this.formRegistro.get('direccion')?.value;
      pedido.poblacion = this.formRegistro.get('poblacion')?.value;
      pedido.codigo_postal = this.formRegistro.get('codigoPostal')?.value;
    }

    this.servicioPedido.crearPedido(pedido).subscribe((pedidoCreado: Pedido) => {
      console.log("Pedido Creado", pedidoCreado);
      this.pedidoIDCreado = pedidoCreado.ID;

      this.servicioPedido.agregarProductosPedido(productosCarrito, pedidoCreado.ID).subscribe((detalles: DetallePedido[]) => {
        console.log("Detalles Pedido", detalles);
        this.renderizarPaypal(); // Renderizar PayPal después de crear pedido y añadir productos
      });
    });
  }

  renderizarPaypal() {
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
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          console.log("Pago aprobado:", order);
          this.servicioPedido.pagarPedido(this.pedidoIDCreado).subscribe(() => {
            console.log("Pedido pagado");
            this.serviciosCarrito.limpiarCarrito();
            this.mostrarAlerta('Pago aprobado. ¡Gracias por tu compra!', true);
          });
        }
        ,
        onError: (err: any) => {
          console.error("Error en el pago:", err);

          this.servicioPedido.cancelarPedido(this.pedidoIDCreado).subscribe(() => {
            console.log("Pedido cancelado");
          });
          this.mostrarAlerta('Ocurrió un error al procesar el pago', true );

        }
      }).render(this.paypalElement.nativeElement);
  }

  mostrarAlerta(mensaje: string, redireccionar: boolean = false) {

    this.alerta.mensaje = mensaje
    this.alerta.mostrar = true

    if (redireccionar) {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000); // ⏱️ espera 3 segundos
    }
  }
}


