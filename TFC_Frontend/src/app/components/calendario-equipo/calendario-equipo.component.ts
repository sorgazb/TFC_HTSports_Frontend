import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { Jugador } from 'src/app/class/jugador';
import { Partido } from 'src/app/class/partido';
import { Usuario } from 'src/app/class/usuario';
import { ServicioPartidoService } from 'src/app/services/servicio-partido.service';

@Component({
  selector: 'app-calendario-equipo',
  templateUrl: './calendario-equipo.component.html',
  styleUrls: ['./calendario-equipo.component.css']
})
export class CalendarioEquipoComponent implements OnInit{

  usuario !: Usuario
  cuerpoTecnico !: CuerpoTecnico
  jugador !: Jugador

  partidosEquipo !: Partido[]

  eventMap: { [fecha: string]: Partido[] } = {};

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
      partido.fecha = new Date(partido.fecha)     
      return partido
      })
              // Llenar el mapa de eventos
        this.eventMap = {};
        this.partidosEquipo.forEach(p => {
          const key = p.fecha.toISOString().slice(0, 10); // 'YYYY-MM-DD'
          if (!this.eventMap[key]) {
            this.eventMap[key] = [];
          }
          this.eventMap[key].push(p);
        });
    })
  }

  constructor(private serviciosPartido : ServicioPartidoService, private router : Router){}
  

    listDataMap = {
    eight: [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' }
    ],
    ten: [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' },
      { type: 'error', content: 'This is error event.' }
    ],
    eleven: [
      { type: 'warning', content: 'This is warning event' },
      { type: 'success', content: 'This is very long usual event........' },
      { type: 'error', content: 'This is error event 1.' },
      { type: 'error', content: 'This is error event 2.' },
      { type: 'error', content: 'This is error event 3.' },
      { type: 'error', content: 'This is error event 4.' }
    ]
  };

  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }
}
