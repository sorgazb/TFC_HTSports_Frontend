import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Equipo } from 'src/app/class/equipo';
import { Partido } from 'src/app/class/partido';
import { ServicioEquipoService } from 'src/app/services/servicio-equipo.service';
import { ServicioPartidoService } from 'src/app/services/servicio-partido.service';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.css']
})
export class PartidosComponent {

  partidos: Partido[] = []
  equipos: Equipo[] = []
  partidosPaginados: Partido[] = []
  
  translate!: TranslateService
  
  mostrarFiltros: boolean = false
    
  filtroEquipo !: number
  flitroFecha !: Date
  
  partidosPagina : number = 9
  paginaActual : number = 1
  totalPaginas !: number

  cargando : boolean = true

  
  constructor(translate : TranslateService, private router : Router, private serviciosPartido : ServicioPartidoService, private serviciosEquipo : ServicioEquipoService) {
    this.translate = translate
  }
  
  ngOnInit(): void {
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }
      
    if(!localStorage.getItem('aficionado')){
      this.router.navigate(['/error'])
    }

    this.serviciosPartido.obtenerPartidos().subscribe((partidos: any[]) => {
      this.partidos = partidos.map(item => {
        const partido = item.partido as Partido
        partido.equipos = item.equipos
        partido.fecha = new Date(partido.fecha)     
        return partido
      })
      this.partidos.sort((a, b) =>
        (b.fecha as Date).getTime() - (a.fecha as Date).getTime())
      const tiempoCancelacion = 100 * 60 * 1000
      this.partidos.forEach(partido => {
        const fechaPartido = new Date(partido.fecha).getTime()
        const fechaLimite = fechaPartido + tiempoCancelacion
        if (partido.estado === 'programado') {
          if(Date.now() === fechaPartido || Date.now() > fechaPartido){
            this.serviciosPartido.jugarPartido(partido.ID).subscribe(() => {
            })
          }
        }
        if (Date.now() > fechaLimite && (partido.estado === 'enjuego' || partido.estado === 'programado')) {
          this.serviciosPartido.finalizarPartido(partido.ID).subscribe(() => {
          })
        }
      })
      this.totalPaginas = Math.ceil(this.partidos.length / this.partidosPagina)
      this.actualizarPartidosPaginados()
      this.cargando = false
    })
    this.serviciosEquipo.obtenerTodosLosEquipos().subscribe((equipos: Equipo[]) => {
      this.equipos = equipos
    })
  }
    
  /*
  * Metodo que renderiza los partidos de la pagina en la que se encuentra el
  * usuario.
  */
  actualizarPartidosPaginados(){
    const inicio = (this.paginaActual - 1) * this.partidosPagina
    const fin = inicio + this.partidosPagina
    this.partidosPaginados = this.partidos.slice(inicio, fin)
  }
  
  /*
  * Metodo que actualiza la pagina a la que quiere dirigirse el usuario.
  * @param {number} => pagina a la que se quiere dirigir el usario.
  */
  cambiarPagina(pagina: number){
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina
      this.actualizarPartidosPaginados()
    }
  }
  
  /*
  * Metodo que redirige al usuario a la pagina de compra de entradas para el partido que ha seleccionado.
  * @param {number} => id del partido seleccionado.
  */
  comprarEntrada(id: number) {
    this.router.navigate(['/entradas', id])
  }

  /*
  * Metodo que redirige al usuario a la pagina del partido que ha seleccionado.
  * @param {number} => id del partido seleccionado.
  */
  consultarPartido(id: number) {
    this.router.navigate(['/partidos', id])
  }
  
  /*
  * Metodo que aplica los filtros establecidos por el usuario a la hora de
  * mostrar los partidos.
  */
  aplicarFiltros() {
    let partidosFiltrados = []
    
    for (let i = 0; i < this.partidos.length; i++) {
      let partido = this.partidos[i]
      let filtrar = true
        
      if (this.filtroEquipo) {
        filtrar = false
        for (let j = 0; j < partido.equipos.length; j++) {
          if (partido.equipos[j].ID == this.filtroEquipo) {
            filtrar = true
            break
          }
        }
      }
      
      if (this.flitroFecha) {
        let fechaFiltro = new Date(this.flitroFecha)
        let fechaPartido = new Date(partido.fecha)
        if (fechaFiltro.getFullYear() !== fechaPartido.getFullYear() || fechaFiltro.getMonth() !== fechaPartido.getMonth() || fechaFiltro.getDate() !== fechaPartido.getDate()) {
          filtrar = false
        }
      }
      
      if (filtrar) {
        partidosFiltrados.push(partido)
      }
    }
      
    this.totalPaginas = Math.max(1, Math.ceil(partidosFiltrados.length / this.partidosPagina))
    this.paginaActual = 1
    this.partidosPaginados = partidosFiltrados.slice(0, this.partidosPagina)
  }
    
  /*
  * Metodo que redirige al usuario hasta la plantilla
  * del equipo seleccionado
  */
  consultarEquipo(idEquipo : number){
    this.router.navigate(['miEquipo/'+idEquipo])
  }
}
