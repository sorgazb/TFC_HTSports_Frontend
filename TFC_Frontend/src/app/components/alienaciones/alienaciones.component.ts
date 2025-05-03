import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Jugador } from 'src/app/class/jugador';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { Usuario } from 'src/app/class/usuario';
import { Equipo } from 'src/app/class/equipo';
import { ServicioUsuarioService } from 'src/app/services/servicio-usuario.service';
import { ServicioEquipoService } from 'src/app/services/servicio-equipo.service';
import html2canvas from 'html2canvas';

interface Cell {
  pos: string;
  id: string;
}

@Component({
  selector: 'app-alienaciones',
  templateUrl: './alienaciones.component.html',
  styleUrls: ['./alienaciones.component.css']
})
export class AlienacionesComponent implements OnInit {

  @ViewChild('capture', { static: false }) 
campo!: ElementRef<HTMLElement>;


public capturaDataUrl: string | null = null;
  
  usuario !: Usuario
  cuerpoTecnico !: CuerpoTecnico

  jugadoresPlantilla : Jugador[] = [];
  porteros : Jugador[] = []
  defensas : Jugador[] = []
  centrocampistas : Jugador[] = []
  delanteros : Jugador[] = []

  jugadoresPosicion : Jugador[] = []

  isLoading: boolean = true;

  // Sistemas y formaciones
  sistemasDeJuego = ['4-4-2','4-3-3','4-2-3-1','3-5-2','3-4-3','5-3-2','4-1-4-1'];
  sistemaSeleccionado = '4-4-2';
  
  formaciones: { [key: string]: string[][] } = {
    '4-4-2': [['POR'], ['DEF','DEF','DEF','DEF'], ['MED','MED','MED','MED'], ['DEL','DEL']],
    '4-3-3': [['POR'], ['DEF','DEF','DEF','DEF'], ['MED','MED','MED'], ['DEL','DEL','DEL']],
    '4-2-3-1': [['POR'], ['DEF','DEF','DEF','DEF'], ['MED','MED'], ['MED','MED','MED'], ['DEL']],
    '3-5-2': [['POR'], ['DEF','DEF','DEF'], ['MED','MED','MED','MED','MED'], ['DEL','DEL']],
    '3-4-3': [['POR'], ['DEF','DEF','DEF'], ['MED','MED','MED','MED'], ['DEL','DEL','DEL']],
    '5-3-2': [['POR'], ['DEF','DEF','DEF','DEF','DEF'], ['MED','MED','MED'], ['DEL','DEL']],
    '4-1-4-1': [['POR'], ['DEF','DEF','DEF','DEF'], ['MED'], ['MED','MED','MED','MED'], ['DEL']]
  };

  posiciones = ['Porteros', 'Defensas', 'Centrocampistas', 'Delanteros'];
  posicionSeleccionada = 'Porteros'



  // Estructura para el campo
  filas: Cell[][] = [];
  // Almacena jugadores por celda
  alineacion: { [cellId: string]: Jugador[] } = {};
  // IDs de todas las listas para conectar drag&drop
  dropListIds: string[] = [];
  
  ngOnInit(): void {
    this.buildField();
    
    let usuarioAux = sessionStorage.getItem('usuario')
    let usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario
  
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
      this.isLoading = false;
    })

    this.cargarJugadoresPosicion(this.posicionSeleccionada)
  }

  constructor(private servicioUsuario : ServicioUsuarioService, private servicioEquipos : ServicioEquipoService, private ngZone: NgZone){}
    
  cambiarSistema() {
    this.buildField();
  }


  seleccionarPosicion(){
    this.cargarJugadoresPosicion(this.posicionSeleccionada)
  }

  cargarJugadoresPosicion(poscion: string){
    if(poscion == 'Porteros'){
      this.jugadoresPosicion = this.porteros
    }else if(poscion == 'Defensas'){
      this.jugadoresPosicion = this.defensas
    }else if(poscion == 'Centrocampistas'){
      this.jugadoresPosicion = this.centrocampistas
    }else if(poscion == 'Delanteros'){
      this.jugadoresPosicion = this.delanteros
    }
  }

  private buildField() {
    // Reconstruye rows, alineacion y dropListIds
    this.filas = [];
    this.alineacion = {};
    this.dropListIds = ['jugadoresPlantilla'];

    const matriz = this.formaciones[this.sistemaSeleccionado];
    matriz.forEach((fila, rowIndex) => {
      const rowCells: Cell[] = [];
      fila.forEach((pos, colIndex) => {
        const cellId = `${this.sistemaSeleccionado}-${rowIndex}-${colIndex}`;
        rowCells.push({ pos, id: cellId });
        this.alineacion[cellId] = [];
        this.dropListIds.push(cellId);
      });
      this.filas.push(rowCells);
    });
  }

  drop(event: CdkDragDrop<Jugador[]>) {
    // Si arrastramos dentro de la misma lista, reordenamos
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  
    } else {
      // Si es una celda de campo, sólo permitimos la transferencia
      // si aún no hay ningún jugador en ella
      const destino = event.container.data;
      if (destino.length === 0) {
        transferArrayItem(
          event.previousContainer.data,
          destino,
          event.previousIndex,
          event.currentIndex
        );
      }
      // si ya hay un jugador, no hacemos nada
    }
  }

  /**
 * Quita un jugador de la celda y lo devuelve a la lista lateral.
 */
quitarJugador(cellId: string, jugador: Jugador) {
  // 1) Eliminar de la alineación
  const arr = this.alineacion[cellId];
  const idx = arr.indexOf(jugador);
  if (idx > -1) {
    arr.splice(idx, 1);
  }

  // 2) Volver a la lista de jugadores disponibles
  this.jugadoresPosicion.push(jugador);
}

async captureField() {
  console.log('Capturando el campo...');
  const element = this.campo.nativeElement;
  const canvas = await html2canvas(element, { useCORS: true });    // :contentReference[oaicite:1]{index=1}
  const dataUrl = canvas.toDataURL('image/png');                   // :contentReference[oaicite:2]{index=2}

  // 1) Asigno para que Angular renderice el <img>
  //    Si hay problemas de CD, lo pongo dentro de NgZone.run()
  this.ngZone.run(() => {
    this.capturaDataUrl = dataUrl;
  });
}
}
