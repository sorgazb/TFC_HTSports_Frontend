import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { JugadorOjeado } from 'src/app/class/jugador-ojeado';
import { ServicioJugadorOjeadoService } from 'src/app/services/servicio-jugador-ojeado.service';
import { CardJugadorOjeadoRegistrarComponent } from '../card-jugador-ojeado-registrar/card-jugador-ojeado-registrar.component';

@Component({
  selector: 'app-area-jugadores-ojeados',
  templateUrl: './area-jugadores-ojeados.component.html',
  styleUrls: ['./area-jugadores-ojeados.component.css']
})
export class AreaJugadoresOjeadosComponent implements OnInit{

  mostrarFiltros : boolean = false

  jugadoresOjeados : JugadorOjeado[] = []
  jugadoresOjeadosPaginados : JugadorOjeado[] = []
  
  cuerpoTecnico !: CuerpoTecnico

  jugadoresPagina : number = 10
  paginaActual : number = 1
  totalPaginas !: number

  filtroPosicion !: string
  filtroEdad !: number
  ordenValoracion !: string

  posiciones = ['Porteros', 'Defensas', 'Centrocampistas', 'Delanteros']
  posicionesEng = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards']

  translate !: TranslateService;

  constructor(private router : Router, private serviciosJugadorOjeado : ServicioJugadorOjeadoService, translate: TranslateService, public registrarJugador : MatDialog){
    this.translate = translate
  }

  ngOnInit(): void {

    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }

    if(!localStorage.getItem('cuerpoTecnico')){
      this.router.navigate(['/error'])
    }

    let cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    let cuerpoTecnicoSesion = JSON.parse(cuerpoTecnicoAux!)
    this.cuerpoTecnico = cuerpoTecnicoSesion

    this.serviciosJugadorOjeado.obtenerJugadoresOjeadosEquipo(this.cuerpoTecnico.ID).subscribe((jugadoresOjeados : JugadorOjeado[])=>{
      this.jugadoresOjeados = jugadoresOjeados
      this.totalPaginas = Math.ceil(this.jugadoresOjeados.length / this.jugadoresPagina)
      this.actualizarJugadoresPaginados()
    })
  }

  /*
  * Metodo que renderiza los jugadores de la pagina en la que se encuentra el
  * usuario.
  */
  actualizarJugadoresPaginados(){
    const inicio = (this.paginaActual - 1) * this.jugadoresPagina
    const fin = inicio + this.jugadoresPagina
    this.jugadoresOjeadosPaginados = this.jugadoresOjeados.slice(inicio, fin)
  }

  /*
  * Metodo que actualiza la pagina a la que quiere dirigirse el usuario.
  * @param {number} => pagina a la que se quiere dirigir el usario.
  */
  cambiarPagina(pagina: number){
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina
      this.actualizarJugadoresPaginados()
    }
  }

  /*
  * Metodo que aplica los filtros establecidos por el usuario a la hora de
  * mostrar los jugadores.
  */
  aplicarFiltros() {
    let jugadoresOjeadosFiltrados = this.jugadoresOjeados

    if (this.filtroPosicion) {
      jugadoresOjeadosFiltrados = jugadoresOjeadosFiltrados.filter(j => j.posicion == this.filtroPosicion)
    }

    if (this.filtroEdad != null) {
      jugadoresOjeadosFiltrados = jugadoresOjeadosFiltrados.filter(p => p.edad >= this.filtroEdad!)
    }


    if (this.ordenValoracion === 'asc') {
      jugadoresOjeadosFiltrados = jugadoresOjeadosFiltrados.sort((a, b) => a.valoracion - b.valoracion)
    } else if (this.ordenValoracion === 'desc') {
      jugadoresOjeadosFiltrados = jugadoresOjeadosFiltrados.sort((a, b) => b.valoracion - a.valoracion)
    }

    this.totalPaginas = Math.max(1, Math.ceil(jugadoresOjeadosFiltrados.length / this.jugadoresPagina))
    this.paginaActual = 1;
    this.jugadoresOjeadosPaginados = jugadoresOjeadosFiltrados.slice(0, this.jugadoresPagina)
  }

  /*
  * Metodo que hace una llamada a la card material para cambiar el idioma de la web.
  */
  registrarNuevoJugador(){
    const cuadroJugador = this.registrarJugador.open(CardJugadorOjeadoRegistrarComponent,{
      width: '800px',
      maxWidth: '90vw', 
    })
    cuadroJugador.afterClosed().subscribe(() => {
        this.serviciosJugadorOjeado.obtenerJugadoresOjeadosEquipo(this.cuerpoTecnico.ID).subscribe((jugadoresOjeados: JugadorOjeado[]) => {
          this.jugadoresOjeados = jugadoresOjeados
          this.totalPaginas = Math.ceil(this.jugadoresOjeados.length / this.jugadoresPagina)
          this.paginaActual = 1
          this.actualizarJugadoresPaginados()
        })
      })
  }
}
