import { Component, OnInit } from '@angular/core';
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
  isLoading: boolean = true;  // Variable para controlar el estado de carga

  porteros : Jugador[] = []
  defensas : Jugador[] = []
  centrocampistas : Jugador[] = []
  delanteros : Jugador[] = []

  equipo !: Equipo

  constructor(private servicioUsuario : ServicioUsuarioService, private servicioEquipos : ServicioEquipoService){}

  ngOnInit(): void {
    let usuarioAux = sessionStorage.getItem('usuario')
    let usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario

    let cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    let cuerpoTecnicoSesion = JSON.parse(cuerpoTecnicoAux!)
    this.cuerpoTecnico = cuerpoTecnicoSesion

    this.servicioEquipos.obtenerEquipoPorId(this.cuerpoTecnico.equipo_id).subscribe((equipo : Equipo) => {
      this.equipo = equipo
    })

    this.servicioUsuario.obtenerCuerposTecnicos(this.cuerpoTecnico.equipo_id).subscribe((cuerpoTecnico : CuerpoTecnico[]) => {
      this.cuerpoTecnicoPlantilla = cuerpoTecnico
      console.log(this.cuerpoTecnicoPlantilla)
    })

    console.log(this.cuerpoTecnicoPlantilla)

    this.servicioUsuario.obtenerJugadores(this.cuerpoTecnico.equipo_id).subscribe((jugadores : Jugador[]) => {
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
      this.isLoading = false;
    })

  }
}
