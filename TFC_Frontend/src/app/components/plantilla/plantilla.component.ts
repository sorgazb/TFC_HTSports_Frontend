import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { Equipo } from 'src/app/class/equipo';
import { Jugador } from 'src/app/class/jugador';
import { Usuario } from 'src/app/class/usuario';
import { ServicioEquipoService } from 'src/app/services/servicio-equipo.service';
import { ServicioUsuarioService } from 'src/app/services/servicio-usuario.service';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css']
})
export class PlantillaComponent implements OnInit{

  jugadoresPlantilla : Jugador[] = [];
  cuerpoTecnicoPlantilla : CuerpoTecnico[] = []
  usuario !: Usuario
  cuerpoTecnico !: CuerpoTecnico

  
  cargando: boolean = true

  porteros : Jugador[] = []
  defensas : Jugador[] = []
  centrocampistas : Jugador[] = []
  delanteros : Jugador[] = []

  equipo !: Equipo

  constructor(private servicioUsuario : ServicioUsuarioService, private servicioEquipos : ServicioEquipoService, private router: Router){}

  ngOnInit(): void {
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }
    
    let usuarioAux = sessionStorage.getItem('usuario')
    let usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario

    let cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    let cuerpoTecnicoSesion = JSON.parse(cuerpoTecnicoAux!)
    this.cuerpoTecnico = cuerpoTecnicoSesion

    let idEquipo = Number(this.router.url.split('/').pop())

    this.servicioEquipos.obtenerEquipoPorId(idEquipo).subscribe((equipo : Equipo) => {
      this.equipo = equipo
    })

    this.servicioUsuario.obtenerCuerposTecnicos(idEquipo).subscribe((cuerpoTecnico : CuerpoTecnico[]) => {
      this.cuerpoTecnicoPlantilla = cuerpoTecnico
    })

    this.servicioUsuario.obtenerJugadores(idEquipo).subscribe((jugadores : Jugador[]) => {
      this.jugadoresPlantilla = jugadores
      for (let jugador of this.jugadoresPlantilla){
        if(jugador.posicion == 'portero'){
          this.porteros.push(jugador)
        }else if(jugador.posicion == 'defensa'){
          this.defensas.push(jugador)
        }else if(jugador.posicion == 'centrocampista'){
          this.centrocampistas.push(jugador)
        }else if(jugador.posicion == 'delantero'){
          this.delanteros.push(jugador)
        }
      }
      console.log(this.jugadoresPlantilla)
      this.cargando = false
    })

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
