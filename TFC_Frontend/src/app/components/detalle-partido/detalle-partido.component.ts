import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActuacionEquipoPartido } from 'src/app/class/actuacion-equipo-partido';
import { Alienacion } from 'src/app/class/alienacion';
import { Jugador } from 'src/app/class/jugador';
import { Partido } from 'src/app/class/partido';
import { ServicioEquipoService } from 'src/app/services/servicio-equipo.service';
import { ServicioPartidoService } from 'src/app/services/servicio-partido.service';
import { ServicioUsuarioService } from 'src/app/services/servicio-usuario.service';

@Component({
  selector: 'app-detalle-partido',
  templateUrl: './detalle-partido.component.html',
  styleUrls: ['./detalle-partido.component.css']
})
export class DetallePartidoComponent implements OnInit, AfterViewInit, OnDestroy {
  
  partido : Partido = {
    ID: 0,
    fecha: new Date(),
    estado: "",
    clima: "",
    resultado: "",
    asistencia: 0,
    equipos: []
  }

  actuacionesEquipos : ActuacionEquipoPartido[] = []

  alienacionesPartido : Alienacion[] = []

  translate!: TranslateService

  color: ThemePalette = 'primary'
  mode: ProgressSpinnerMode = 'determinate'

  porcentajeTirosTotalesEquipo1 = 0
  porcentajeTirosTotalesEquipo2 = 0
  porcentajeTirosPorteriaEquipo1 = 0
  porcentajeTirosPorteriaEquipo2 = 0
  porcentajeFaltasRealizadasEquipo1 = 0
  porcentajeFaltasRealizadasEquipo2 = 0
  porcentajeCornersFavorEquipo1 = 0
  porcentajeCornersFavorEquipo2 = 0
  porcentajeCornersContraEquipo1 = 0
  porcentajeCornersContraEquipo2 = 0

  private intervaloActualizacion: any

  jugadoresEquipoLocal : Jugador [] = []
  jugadoresEquipoVisitante : Jugador [] = []

  cargando: boolean = true
  
  constructor(translate : TranslateService, private router : Router, private serviciosPartido : ServicioPartidoService, private serviciosEquipo : ServicioEquipoService, private serviciosUsuario : ServicioUsuarioService) {
    this.translate = translate
  }
    
  ngOnInit(): void {

    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }

    let idPartido = Number(this.router.url.split('/').pop())
    this.serviciosPartido.obtenerPartido(idPartido).subscribe((partido: any) => {
      this.actuacionesEquipos = partido.actuaciones
      for(let actuacion of partido.actuaciones){
        this.alienacionesPartido.push(actuacion.alineacion)
      }
      let infoPartido = partido.partido
      let equiposPartido = partido.equipos
      this.partido.ID = infoPartido.ID
      this.partido.fecha = new Date(infoPartido.fecha)
      this.partido.estado = infoPartido.estado
      this.partido.clima = infoPartido.clima
      this.partido.resultado = infoPartido.resultado
      this.partido.asistencia = infoPartido.asistencia
      this.partido.equipos = equiposPartido
      
      this.generarEstadisticasEquipos()

      this.serviciosUsuario.obtenerJugadoresAlineacion(this.partido.equipos[0].ID).subscribe((juagdoresEquipo : Jugador[])=>{
        this.jugadoresEquipoLocal = juagdoresEquipo
        this.jugadoresEquipoLocal.sort((a : Jugador,b : Jugador) => a.dorsal - b.dorsal)
      })

      this.serviciosUsuario.obtenerJugadoresAlineacion(this.partido.equipos[1].ID).subscribe((juagdoresEquipo : Jugador[])=>{
        this.jugadoresEquipoVisitante = juagdoresEquipo
        this.jugadoresEquipoVisitante.sort((a : Jugador,b : Jugador) => a.dorsal - b.dorsal)
      })
      this.cargando = false
    })
  }

  ngAfterViewInit(): void {
    if (this.partido.estado === 'enjuego' || this.partido.estado === 'Enjane') {
      this.intervaloActualizacion = setInterval(() => {
        let idPartido = this.partido.ID
        this.serviciosPartido.obtenerPartido(idPartido).subscribe((partido: any) => {
          this.actuacionesEquipos = partido.actuaciones
          let infoPartido = partido.partido
          this.partido.resultado = infoPartido.resultado
          this.generarEstadisticasEquipos()
        })
      }, 30000)
    }
  }
  
  ngOnDestroy(): void {
    if (this.intervaloActualizacion) {
      clearInterval(this.intervaloActualizacion)
    }
  }

  /*
  * Metodo que genera las estadisticas del partido que ha selecccionado el Usuario.
  */
  generarEstadisticasEquipos() {
    
    const totalTiros = this.actuacionesEquipos[0].tiros_totales + this.actuacionesEquipos[1].tiros_totales
    this.porcentajeTirosTotalesEquipo1 = (this.actuacionesEquipos[0].tiros_totales / totalTiros) * 100
    this.porcentajeTirosTotalesEquipo2 = (this.actuacionesEquipos[1].tiros_totales / totalTiros) * 100

    const totalTirosPorteria = this.actuacionesEquipos[0].tiros_porteria + this.actuacionesEquipos[1].tiros_porteria
    this.porcentajeTirosPorteriaEquipo1 = (this.actuacionesEquipos[0].tiros_porteria / totalTirosPorteria) * 100
    this.porcentajeTirosPorteriaEquipo2 = (this.actuacionesEquipos[1].tiros_porteria / totalTirosPorteria) * 100

    const totalFaltas = this.actuacionesEquipos[0].faltas_realizadas + this.actuacionesEquipos[1].faltas_realizadas
    this.porcentajeFaltasRealizadasEquipo1 = (this.actuacionesEquipos[0].faltas_realizadas / totalFaltas) * 100
    this.porcentajeFaltasRealizadasEquipo2 = (this.actuacionesEquipos[1].faltas_realizadas / totalFaltas) * 100

    const totalCornersFavor = this.actuacionesEquipos[0].corners_favor + this.actuacionesEquipos[1].corners_favor
    this.porcentajeCornersFavorEquipo1 = (this.actuacionesEquipos[0].corners_favor / totalCornersFavor) * 100
    this.porcentajeCornersFavorEquipo2 = (this.actuacionesEquipos[1].corners_favor / totalCornersFavor) * 100
        
    const totalCornersContra = this.actuacionesEquipos[0].corners_contra + this.actuacionesEquipos[1].corners_contra
    this.porcentajeCornersContraEquipo1 = (this.actuacionesEquipos[0].corners_contra / totalCornersContra) * 100
    this.porcentajeCornersContraEquipo2 = (this.actuacionesEquipos[1].corners_contra / totalCornersContra) * 100
  }

  /*
  * Metodo que redirige al usuario hasta la plantilla
  * del equipo seleccionado
  */
  consultarEquipo(idEquipo : number){
    this.router.navigate(['miEquipo/'+idEquipo])
  }

  /*
  * Metodo que dirige al usuario al perfil del jugador seleccionado
  * @param {number} id del jugador seleccionado
  */
  perfilJugador(idJugador : number){
    console.log(idJugador)
    this.router.navigate(['/jugador', idJugador])
  }

}
  