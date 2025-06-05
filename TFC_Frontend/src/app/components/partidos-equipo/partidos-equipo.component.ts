import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { Equipo } from 'src/app/class/equipo';
import { Jugador } from 'src/app/class/jugador';
import { Partido } from 'src/app/class/partido';
import { Usuario } from 'src/app/class/usuario';
import { ServicioEquipoService } from 'src/app/services/servicio-equipo.service';
import { ServicioPartidoService } from 'src/app/services/servicio-partido.service';

@Component({
  selector: 'app-partidos-equipo',
  templateUrl: './partidos-equipo.component.html',
  styleUrls: ['./partidos-equipo.component.css']
})
export class PartidosEquipoComponent implements OnInit{

  usuario !: Usuario
  cuerpoTecnico !: CuerpoTecnico
  jugador !: Jugador

  partidosEquipo !: Partido[]

  mostrarFiltros: boolean = false
    
  filtroEquipo !: number
  flitroFecha !: Date

  partidosPaginados: Partido[] = []
  partidosPagina : number = 8
  paginaActual : number = 1
  totalPaginas !: number
  
  equipos: Equipo[] = []

  cargando : boolean = true
  
  ngOnInit(): void {
    
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }
    
    if(!localStorage.getItem('cuerpoTecnico')){
      if(!localStorage.getItem('jugador')){
        this.router.navigate(['/error'])
      }
    }

    let usuarioAux = sessionStorage.getItem('usuario')
    let usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario

    let cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    let cuerpoTecnicoSesion = JSON.parse(cuerpoTecnicoAux!)
    this.cuerpoTecnico = cuerpoTecnicoSesion

    let jugadorAux = localStorage.getItem('jugador')
    let jugadorSesison = JSON.parse(jugadorAux!)
    this.jugador = jugadorSesison

    let idEquipo = 0

    if(this.cuerpoTecnico){
      idEquipo = this.cuerpoTecnico.equipo_id
    }

    if(this.jugador){
      idEquipo = this.jugador.equipo_id
    }

    this.serviciosPartido.obtenerPartidosEquipo(idEquipo).subscribe((partidos: any[])=>{
      this.partidosEquipo = partidos.map(item => {
        const partido = item.partido as Partido
        partido.equipos = item.equipos
        partido.fecha = new Date(partido.fecha)     
        return partido
      })
      this.partidosEquipo.sort((a, b) =>
        (b.fecha as Date).getTime() - (a.fecha as Date).getTime())
      const tiempoCancelacion = 100 * 60 * 1000
      this.partidosEquipo.forEach(partido => {
        const fechaPartido = new Date(partido.fecha).getTime()
        const fechaLimite = fechaPartido + tiempoCancelacion
        if (partido.estado === 'programado') {
          if(Date.now() === fechaPartido || Date.now() > fechaPartido){
            this.serviciosPartido.jugarPartido(partido.ID).subscribe(() => {})
          }
        }
        if (Date.now() > fechaLimite && (partido.estado === 'enjuego' || partido.estado === 'programado')) {
          this.serviciosPartido.finalizarPartido(partido.ID).subscribe(() => {})
        }
      })
      this.totalPaginas = Math.ceil(this.partidosEquipo.length / this.partidosPagina)
      this.actualizarPartidosPaginados()
      this.cargando = false
    })

    this.serviciosEquipo.obtenerTodosLosEquipos().subscribe((equipos: Equipo[]) => {
      this.equipos = equipos
    })
  }

  constructor(private serviciosPartido : ServicioPartidoService, private serviciosEquipo : ServicioEquipoService, private router : Router){}
  
  /*
  * Metodo que renderiza los partidos de la pagina en la que se encuentra el
  * usuario.
  */
  actualizarPartidosPaginados(){
    const inicio = (this.paginaActual - 1) * this.partidosPagina
    const fin = inicio + this.partidosPagina
    this.partidosPaginados = this.partidosEquipo.slice(inicio, fin)
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
  * Metodo que aplica los filtros establecidos por el usuario a la hora de
  * mostrar los partidos.
  */
  aplicarFiltros() {
    let partidosFiltrados = []
    for (let i = 0; i < this.partidosEquipo.length; i++) {
      let partido = this.partidosEquipo[i]
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
  * Metodo que redirige al usuario a la pagina del partido para establecer su alinecion
  * que ha seleccionado.
  * @param {number} => id del partido seleccionado.
  */
  establecerAlineacion(id: number) {
    this.router.navigate(['/alineacion', id])
  }

  /*
  * Metodo que redirige al usuario a la pagina del partido que ha seleccionado.
  * @param {number} => id del partido seleccionado.
  */
  consultarPartido(id: number) {
    this.router.navigate(['/partidos', id])
  }

  /*
  * Metodo que redirige al usuario hasta la plantilla
  * del equipo seleccionado
  */
  consultarEquipo(idEquipo : number){
    this.router.navigate(['miEquipo/'+idEquipo])
  }
}
