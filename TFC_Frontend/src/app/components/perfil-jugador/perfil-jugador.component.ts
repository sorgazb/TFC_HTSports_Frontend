import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EstadisticasTotalesJugador } from 'src/app/class/estadisticas-totales-jugador';
import { Jugador } from 'src/app/class/jugador';
import { ServicioEstadisticasTotalesJugadorService } from 'src/app/services/servicio-estadisticas-totales-jugador.service';
import { ServicioUsuarioService } from 'src/app/services/servicio-usuario.service';

@Component({
  selector: 'app-perfil-jugador',
  templateUrl: './perfil-jugador.component.html',
  styleUrls: ['./perfil-jugador.component.css']
})
export class PerfilJugadorComponent implements OnInit{

  jugador !: Jugador
  estadisticasTotalesJugador !: EstadisticasTotalesJugador

  constructor(private serviciosUsuario : ServicioUsuarioService, private servicioEstadisticasJugador :  ServicioEstadisticasTotalesJugadorService, private router : Router){}

  ngOnInit(): void {
    
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }
    
    let id = Number(this.router.url.split('/').pop())
    this.serviciosUsuario.obtenerJugadorPlantilla(id).subscribe((jugador: Jugador) => {
      this.jugador = jugador
    })
    this.servicioEstadisticasJugador.obtenerEstadisticasTotalesJugador(id).subscribe((estadisticas: EstadisticasTotalesJugador) => {
      this.estadisticasTotalesJugador = estadisticas
    })
  }
}
