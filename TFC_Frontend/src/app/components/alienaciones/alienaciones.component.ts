import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Jugador } from 'src/app/class/jugador';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { Usuario } from 'src/app/class/usuario';
import { ServicioUsuarioService } from 'src/app/services/servicio-usuario.service';
import { ServicioEquipoService } from 'src/app/services/servicio-equipo.service';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { Alienacion } from 'src/app/class/alienacion';
import { ServicioAlineacionService } from 'src/app/services/servicio-alineacion.service';
import { ServicioPartidoService } from 'src/app/services/servicio-partido.service';
import { TranslateService } from '@ngx-translate/core';

interface Casillas {
  posicion: string
  id: string
}

@Component({
  selector: 'app-alienaciones',
  templateUrl: './alienaciones.component.html',
  styleUrls: ['./alienaciones.component.css']
})
export class AlienacionesComponent implements OnInit {
  
  @ViewChild('capture', { static: false }) campo!: ElementRef<HTMLElement>
  
  public capturaDataUrl: string | null = null
  
  usuario !: Usuario
  cuerpoTecnico !: CuerpoTecnico
  
  alienacionPartido: Alienacion = {
    ID: 0,
    id_Cuerpo_Tecnico: 0,
    sistema_juego: '',
    alineacion: '',
    imagen_alineacion: ''
  }

  nombreAlienacion = ''

  alineacionesEquipo !: Alienacion[]
  jugadoresPlantilla : Jugador[] = []
  porteros : Jugador[] = []
  defensas : Jugador[] = []
  centrocampistas : Jugador[] = []
  delanteros : Jugador[] = []

  alienacionSeleccionada !: Alienacion

  jugadoresPosicion : Jugador[] = []

  sistemasDeJuego = ['4-4-2','4-3-3','4-2-3-1','3-5-2','3-4-3','5-3-2','4-1-4-1']
  sistemaSeleccionado = '4-4-2'
  formaciones: { [key: string]: string[][] } = {
    '4-4-2': [['POR'], ['DEF','DEF','DEF','DEF'], ['MED','MED','MED','MED'], ['DEL','DEL']],
    '4-3-3': [['POR'], ['DEF','DEF','DEF','DEF'], ['MED','MED','MED'], ['DEL','DEL','DEL']],
    '4-2-3-1': [['POR'], ['DEF','DEF','DEF','DEF'], ['MED','MED'], ['MED','MED','MED'], ['DEL']],
    '3-5-2': [['POR'], ['DEF','DEF','DEF'], ['MED','MED','MED','MED','MED'], ['DEL','DEL']],
    '3-4-3': [['POR'], ['DEF','DEF','DEF'], ['MED','MED','MED','MED'], ['DEL','DEL','DEL']],
    '5-3-2': [['POR'], ['DEF','DEF','DEF','DEF','DEF'], ['MED','MED','MED'], ['DEL','DEL']],
    '4-1-4-1': [['POR'], ['DEF','DEF','DEF','DEF'], ['MED'], ['MED','MED','MED','MED'], ['DEL']]
  }

  posiciones = ['Porteros', 'Defensas', 'Centrocampistas', 'Delanteros']
  posicionesEng = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards']
  posicionSeleccionada = 'Porteros'

  filas: Casillas[][] = []
  alineacion: { [cellId: string]: Jugador[] } = {}

  lista: string[] = []

  translate !: TranslateService
  cargando: boolean = true

  alineacionVacia : boolean = false
  alineacionEstablecida : boolean = false
  
  ngOnInit(): void {
    this.cargarCampo()
  
    let usuarioAux = sessionStorage.getItem('usuario')
    if(!usuarioAux){
      this.router.navigate(['/error'])
      this.cargando = false
    }

    let usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario

    if(this.usuario.tipo != 'cuerpotecnico'){
      this.router.navigate(['/error'])
      this.cargando = false
    }
  
    let cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    let cuerpoTecnicoSesion = JSON.parse(cuerpoTecnicoAux!)
    this.cuerpoTecnico = cuerpoTecnicoSesion
    
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
      this.cargando = false
    })
    this.cargarJugadoresPosicion(this.posicionSeleccionada)

    this.servicioAlineacion.obtenerAlienacionesEquipo(this.cuerpoTecnico.ID).subscribe((alineaciones : Alienacion[])=>{
      this.alineacionesEquipo = alineaciones
    })
  }

  constructor(private servicioUsuario : ServicioUsuarioService, private servicioEquipos : ServicioEquipoService, private ngZone: NgZone, 
    private router : Router, private servicioAlineacion : ServicioAlineacionService, private servicioPartido : ServicioPartidoService, 
    translate: TranslateService){
      this.translate = translate
    }
  
  /*
  * Metodo que hace una llamada al metodo de cargar campo cuando el usuario cambia
  * el sistema de juego en el area de creacion de
  */
  cambiarSistema() {
    this.cargarCampo()
  }

  /*
  * Metodo que hace una llamada al metodo que cagar los jugadores 
  * de la posicion seleccionada por el usuario
  */
  seleccionarPosicion(){
    this.cargarJugadoresPosicion(this.posicionSeleccionada)
  }

  /*
  * Metodo que carga en area de posicion los jugadores de la 
  * posicion especificada por el usuario
  */ 
  cargarJugadoresPosicion(poscion: string){
    if(poscion == 'Porteros' || poscion == 'Goalkeepers'){
      this.jugadoresPosicion = this.porteros
    }else if(poscion == 'Defensas' || poscion == 'Defenders'){
      this.jugadoresPosicion = this.defensas
    }else if(poscion == 'Centrocampistas' || poscion == 'Midfielders'){
      this.jugadoresPosicion = this.centrocampistas
    }else if(poscion == 'Delanteros' || poscion == 'Forwards'){
      this.jugadoresPosicion = this.delanteros
    }
  }

  /*
  * Metodo que carga en el campo la formacion  
  * especificada por el usuario
  */ 
  cargarCampo() {
    this.filas = []
    this.alineacion = {}
    this.lista = ['jugadoresPlantilla']

    const matriz = this.formaciones[this.sistemaSeleccionado]
    matriz.forEach((fila, indiceFila) => {
      const casillasFila: Casillas[] = []
      fila.forEach((posicion, indiceColumna) => {
        const idCasilla = `${this.sistemaSeleccionado}-${indiceFila}-${indiceColumna}`
        casillasFila.push({ posicion, id: idCasilla })
        this.alineacion[idCasilla] = []
        this.lista.push(idCasilla)
      })
      this.filas.push(casillasFila)
    })
  }

  /*
  * Metodo de Angular Material que es el 
  * encargado de la funcionalidad Drag And Drop
  * @param {event} => envento de tipo Jugador.
  */ 
  drop(event: CdkDragDrop<Jugador[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      const destino = event.container.data
      if (destino.length === 0) {
        transferArrayItem(
          event.previousContainer.data,
          destino,
          event.previousIndex,
          event.currentIndex
        )
      }
    }
  }
  
  /*
  * Metodo que borra de la alineacion al Jugador
  * seleccionado y le manda de vuelta al array de posiciones correspondiente
  * @param {event} => envento de tipo Jugador.
  */ 
  quitarJugador(indiceCelda: string, jugador: Jugador) {
    const arrayJugador = this.alineacion[indiceCelda]
    const indiceJugador = arrayJugador.indexOf(jugador)
    if (indiceJugador > -1) {
      arrayJugador.splice(indiceJugador, 1)
    }

    if(jugador.posicion == 'portero'){
      this.porteros.push(jugador)
    }else if(jugador.posicion == 'defensa'){
      this.defensas.push(jugador)
    }else if(jugador.posicion == 'centrocampista'){
      this.centrocampistas.push(jugador)
    }else{
      this.delanteros.push(jugador)
    }    
  }
  
  /*
  * Metodo que se encarga de establecer la alineacion para el partido seleccionado,
  * en el caso de que el usuario haya seleccionado una alineacion existente directamente
  * se asignara al partido, y en caso de que cree una nueva se procedera a la creacion de
  * la misma para despues asignarla al partido.
  */
  establecerAlienacion(){
    if(this.alienacionSeleccionada == null && this.nombreAlienacion == ''){
      this.alineacionVacia = true
    }else{
      let idPartido = Number(this.router.url.split('/').pop())
      if(this.alienacionSeleccionada == null){
        this.captureField().then(() => {
          const alineacion = {
            id_Cuerpo_Tecnico: this.cuerpoTecnico.ID,
            sistema_juego: this.sistemaSeleccionado,
            alineacion: this.nombreAlienacion,
            imagen_alineacion: this.alienacionPartido.imagen_alineacion
          }
          this.servicioAlineacion.crearAlineacion(alineacion as any).subscribe(alineacion => {
            this.servicioPartido.actualizarAlineacionEquipo(idPartido, this.cuerpoTecnico.equipo_id, alineacion.ID).subscribe()
          })
        })
      }else{
        this.servicioPartido.actualizarAlineacionEquipo(idPartido, this.cuerpoTecnico.equipo_id, this.alienacionSeleccionada.ID).subscribe(()=>{})
      }
      this.alineacionEstablecida = true
      setTimeout(() => {
        this.router.navigate([`/partidos/equipo/${this.cuerpoTecnico.equipo_id}`])
      }, 3000)
    }
  }
  
  /*
   * Metodo que realiza una captura la alineacion con PNG mediante la libreria html2canvas
   */
  async captureField(): Promise<void> {
    const element = this.campo.nativeElement
    const canvas = await html2canvas(element, { useCORS: true })
    const dataUrl = canvas.toDataURL('image/png')
    this.ngZone.run(() => {
      this.capturaDataUrl = dataUrl
      this.alienacionPartido.imagen_alineacion = dataUrl.split(',')[1]
    })
  }
  
}
