import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { ServicioSesionEntrenamientoService } from 'src/app/services/servicio-sesion-entrenamiento.service';
import { CardSesionEntrenamientoRegistrarComponent } from '../card-sesion-entrenamiento-registrar/card-sesion-entrenamiento-registrar.component';

@Component({
  selector: 'app-area-entrenamientos',
  templateUrl: './area-entrenamientos.component.html',
  styleUrls: ['./area-entrenamientos.component.css']
})
export class AreaEntrenamientosComponent {

  mostrarFiltros : boolean = false

  cuerpoTecnico !: CuerpoTecnico

  translate !: TranslateService

  constructor(private router : Router, private servicioSesionEntrenamiento : ServicioSesionEntrenamientoService, translate: TranslateService, public registrarSesionEntrenamiento : MatDialog){
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
  
    // this.serviciosJugadorOjeado.obtenerJugadoresOjeadosEquipo(this.cuerpoTecnico.equipo_id).subscribe((jugadoresOjeados : JugadorOjeado[])=>{
    //   this.jugadoresOjeados = jugadoresOjeados
    //   this.totalPaginas = Math.ceil(this.jugadoresOjeados.length / this.jugadoresPagina)
    //   this.actualizarJugadoresPaginados()
    // })
  }

  /*
  * Metodo que hace una llamada a la card material para cambiar el idioma de la web.
  */
  registrarNuevaSesionEntrenamiento(){
    const cuadroSesionEntrenamiento = this.registrarSesionEntrenamiento.open(CardSesionEntrenamientoRegistrarComponent,{
      width: '800px',
      maxWidth: '90vw', 
    })
    cuadroSesionEntrenamiento.afterClosed().subscribe(() => {
        // this.serviciosJugadorOjeado.obtenerJugadoresOjeadosEquipo(this.cuerpoTecnico.ID).subscribe((jugadoresOjeados: JugadorOjeado[]) => {
        //   this.jugadoresOjeados = jugadoresOjeados
        //   this.totalPaginas = Math.ceil(this.jugadoresOjeados.length / this.jugadoresPagina)
        //   this.paginaActual = 1
        //   this.actualizarJugadoresPaginados()
        // })
     })
    }
}
