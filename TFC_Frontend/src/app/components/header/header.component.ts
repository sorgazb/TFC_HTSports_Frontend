import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CardIdiomaComponent } from '../card-idioma/card-idioma.component';
import { MatDialog } from '@angular/material/dialog';
import { ServicioCarritoService } from '../../services/servicio-carrito.service';
import { Carrito } from '../../class/carrito';
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

  isMenuOpen: boolean = false

  usuario : any = null
  aficionado : any = null

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

  cambiarIdioma(){
    const cuadroIdioma = this.dialog.open(CardIdiomaComponent)
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

    this.btnAbrir = document.getElementById('btnAbrir') as HTMLElement
    this.btnCerrar = document.getElementById('btnCerrar') as HTMLElement
    this.servicioCarrito.carrito$.subscribe(carrito => {
      this.productosCarrito = carrito
      this.cantidadProductos = carrito.reduce((total, item) => total + item.cantidad, 0)
    })
  }
  
  handleClick() {
    if (!this.collapseMenu) return;
    const menu = this.collapseMenu.nativeElement
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block'
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  clickedOutside() {
    this.isMenuOpen = false
  }

  cerrarSesion() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('usuario')
    localStorage.removeItem('aficionado')
    localStorage.removeItem('carrito')
    this.servicioCarrito.limpiarCarrito()
    this.router.navigate(['/']).then(() => {
      window.location.reload()
    })
  }

}