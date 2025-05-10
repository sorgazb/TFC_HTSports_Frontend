import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CardIdiomaComponent } from '../card-idioma/card-idioma.component';
import { MatDialog } from '@angular/material/dialog';
import { ServicioCarritoService } from '../../services/servicio-carrito.service';
import { Carrito } from '../../class/carrito';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { Jugador } from 'src/app/class/jugador';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('collapseMenu', { static: false }) collapseMenu!: ElementRef

  productosCarrito: Carrito[] = []

  mostrarBarraNav : boolean = true

  btnAbrir !: HTMLElement
  btnCerrar !: HTMLElement

  cantidadProductos : number = 0

  carritoVacio : boolean = true
  menuDesplegado: boolean = false

  usuario : any = null
  aficionado : any = null
  cuerpoTecnico !: CuerpoTecnico
  jugador !: Jugador

  constructor (private router : Router, public dialog: MatDialog, private servicioCarrito: ServicioCarritoService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if(this.router.url === '/inicioSesion' || this.router.url === '/registro'){
        this.mostrarBarraNav = false
      }else{
        this.mostrarBarraNav = true
      }
    })
  }

  ngOnInit(): void {
    const tokenGuardado = sessionStorage.getItem('token')
    const usuarioGuardado = sessionStorage.getItem('usuario')
    
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado)
    }

    const aficionadoGuardado = localStorage.getItem('aficionado')
    if (aficionadoGuardado) {
      this.aficionado = JSON.parse(aficionadoGuardado)
    }

    const cuerpoTecnicoGuardado = localStorage.getItem('cuerpoTecnico')
    if (cuerpoTecnicoGuardado) {
      this.cuerpoTecnico = JSON.parse(cuerpoTecnicoGuardado)
    }

    const jugadorGuardado = localStorage.getItem('jugador')
    if(jugadorGuardado){
      const datos = JSON.parse(jugadorGuardado)
      datos.id = datos.ID
      delete datos.ID
      this.jugador = datos
    }

    this.btnAbrir = document.getElementById('btnAbrir') as HTMLElement
    this.btnCerrar = document.getElementById('btnCerrar') as HTMLElement
    this.servicioCarrito.carrito$.subscribe(carrito => {
      this.productosCarrito = carrito
      this.cantidadProductos = carrito.reduce((total, item) => total + item.cantidad, 0)
    })
  }

  /*
  * Metodo que hace una llamada a la card material para cambiar el idioma de la web.
  */
  cambiarIdioma(){
    const cuadroIdioma = this.dialog.open(CardIdiomaComponent)
  }
  
  /*
   * Metodo para mostrar u ocultar el menu de navegacion (en moviles).
   */
  mostrarNav() {
    if (!this.collapseMenu) return;
    const menu = this.collapseMenu.nativeElement
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
  }

  /*
   * Metodo que muestra el menu de Usuario.
   */
  menuOpciones() {
    this.menuDesplegado = !this.menuDesplegado
  }

  /*
  * Metodo que cierra el menu de Usuario.
  */ 
  clickFuera() {
    this.menuDesplegado = false
  }

  /*
  * Metodo que borra todas las sesiones y local storages creadas.
  */
  cerrarSesion() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('usuario')
    localStorage.removeItem('aficionado')
    localStorage.removeItem('cuerpoTecnico')
    localStorage.removeItem('jugador')
    localStorage.removeItem('carrito')
    this.servicioCarrito.limpiarCarrito()
    this.router.navigate(['/']).then(() => {
      window.location.reload()
    })
  }

}