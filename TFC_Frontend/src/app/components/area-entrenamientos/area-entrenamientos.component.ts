import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { ServicioSesionEntrenamientoService } from 'src/app/services/servicio-sesion-entrenamiento.service';
import { CardSesionEntrenamientoRegistrarComponent } from '../card-sesion-entrenamiento-registrar/card-sesion-entrenamiento-registrar.component';
import { SesionEntrenamiento } from 'src/app/class/sesion-entrenamiento';
import { Entrenamiento } from 'src/app/class/entrenamiento';
import { Jugador } from 'src/app/class/jugador';

@Component({
  selector: 'app-area-entrenamientos',
  templateUrl: './area-entrenamientos.component.html',
  styleUrls: ['./area-entrenamientos.component.css']
})
export class AreaEntrenamientosComponent {
  cuerpoTecnico !: CuerpoTecnico
  jugador !: Jugador
  translate !: TranslateService
  sesionesEntrenamiento : SesionEntrenamiento [] = []

  constructor(private cd: ChangeDetectorRef,private router : Router, private servicioSesionEntrenamiento : ServicioSesionEntrenamientoService, translate: TranslateService, public registrarSesionEntrenamiento : MatDialog){
    this.translate = translate
  }

  ngOnInit(): void {

    let idEquipo = 0
  
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }
    
    if(!localStorage.getItem('cuerpoTecnico')){
      if(!localStorage.getItem('jugador')){
        this.router.navigate(['/error'])
      }
    }
  
    let cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    let cuerpoTecnicoSesion = JSON.parse(cuerpoTecnicoAux!)
    this.cuerpoTecnico = cuerpoTecnicoSesion

    let jugadorAux = localStorage.getItem('jugador')
    let jugadorSesion = JSON.parse(jugadorAux!)
    this.jugador = jugadorSesion

    if(!this.cuerpoTecnico){
      idEquipo = this.jugador.equipo_id
    }else{
      idEquipo = this.cuerpoTecnico.equipo_id
    }

    this.servicioSesionEntrenamiento.obtenerSesionesEntrenamientoEquipo(idEquipo).subscribe((sesionEntrenamiento : SesionEntrenamiento [])=>{
      this.sesionesEntrenamiento = sesionEntrenamiento
    })
  }

  /*
  * Metodo que hace una llamada a la card material para registrar una nueva sesion de entrenamiento.
  */
  registrarNuevaSesionEntrenamiento(){
    const cuadroSesionEntrenamiento = this.registrarSesionEntrenamiento.open(CardSesionEntrenamientoRegistrarComponent,{
      width: '800px',
      maxWidth: '90vw', 
    })
    cuadroSesionEntrenamiento.afterClosed().subscribe(() => {
      let idEquipo = this.cuerpoTecnico.equipo_id
      this.servicioSesionEntrenamiento.obtenerSesionesEntrenamientoEquipo(idEquipo).subscribe((sesionEntrenamiento : SesionEntrenamiento [])=>{
        this.sesionesEntrenamiento = sesionEntrenamiento
      })
    })
  }
  
  /*
  * Metodo que hace una llamada al servicio de obtener entrenamiento de una sesion
  * @param {number} => id de la sesion
  */
  cargarEntrenamientosSesion(sesionId: number) {
    this.servicioSesionEntrenamiento.obtenerEntrenamientosSesion(sesionId).subscribe({
      next: (sesionCompleta) => {
        const sesionIndex = this.sesionesEntrenamiento.findIndex(s => s.ID === sesionId);
        this.sesionesEntrenamiento[sesionIndex].DetallesSesion = sesionCompleta.DetallesSesion
        this.sesionesEntrenamiento = [...this.sesionesEntrenamiento]
        this.cd.detectChanges()
        }
    })
  }
}
