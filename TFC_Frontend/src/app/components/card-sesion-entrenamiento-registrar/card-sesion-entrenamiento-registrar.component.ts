import { formatDate, Time } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, Form, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { DetalleSesion } from 'src/app/class/detalle-sesion';
import { Entrenamiento } from 'src/app/class/entrenamiento';
import { SesionEntrenamiento } from 'src/app/class/sesion-entrenamiento';
import { ServicioEntrenamientoService } from 'src/app/services/servicio-entrenamiento.service';
import { ServicioSesionEntrenamientoService } from 'src/app/services/servicio-sesion-entrenamiento.service';

@Component({
  selector: 'app-card-sesion-entrenamiento-registrar',
  templateUrl: './card-sesion-entrenamiento-registrar.component.html',
  styleUrls: ['./card-sesion-entrenamiento-registrar.component.css']
})
export class CardSesionEntrenamientoRegistrarComponent implements OnInit{
  
  cuerpoTecnico !: CuerpoTecnico
  
  sesionEntrenamiento : SesionEntrenamiento = {
    ID : 0,
    id_Cuerpo_Tecnico : 0,
    id_Equipo : 0,
    fecha_Inicio : '',
    fecha_Fin : ''
  }

  nuevoEntrenamiento : Entrenamiento = {
    ID : 0,
    id_cuerpo_tecnico : 0,
    descripcion : '',
    tipo : '',
    duracion : {hours : 0, minutes: 0}
  }

  entrenamientosSesion : DetalleSesion [] = []
  
  usarEntrenamiento : boolean = false

  diasSesion !: number

  mostrarDiasSesion : boolean = false

  formNuevaSesion !: FormGroup

  translate !: TranslateService

  tiposEntrenamientoEsp = ['fisico', 'tecnico', 'tactico', 'recuperacion', 'gimnasio', 'prepartido']
  tiposEntrenamientoEng = ['physical', 'technical', 'tactical', 'recovery', 'gym', 'pre-match']

  ngOnInit(): void {
  
    let cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    let cuerpoTecnicoSesion = JSON.parse(cuerpoTecnicoAux!)
    this.cuerpoTecnico = cuerpoTecnicoSesion
  
    this.formNuevaSesion = new FormGroup({
      rangoFechas: new FormGroup({
        fechaInicio: new FormControl('', Validators.required),
        fechaFin:   new FormControl('', Validators.required)
      })
    }, { validators: this.validarRangoFechas })
  }

  constructor(public dialogRef: MatDialogRef<CardSesionEntrenamientoRegistrarComponent>, @Inject(MAT_DIALOG_DATA) public data:any, translate : TranslateService, private servicioSesionEntrenamiento : ServicioSesionEntrenamientoService, private servicioEntrenamiento : ServicioEntrenamientoService){
    this.translate = translate
  }

  private validarRangoFechas(group: AbstractControl): ValidationErrors | null {
    const fechaIncio = group.get('rangoFechas.fechaInicio')!.value
    const fechaFin   = group.get('rangoFechas.fechaFin')!.value
    if (fechaIncio && fechaFin && new Date(fechaFin) < new Date(fechaIncio)) {
      return { rangoInvalido: true }
    }else if (fechaIncio  && new Date(fechaIncio) < new Date(Date.now())) {
      return {inferiorActual: true }
    }
    return null
  }

  establecerEntrenamientosSesion(){
    const fechaInicio: Date = this.formNuevaSesion.get('rangoFechas.fechaInicio')!.value
    const fechaFin:    Date = this.formNuevaSesion.get('rangoFechas.fechaFin')!.value
    
    const formatoFecha = "yyyy-MM-dd'T'HH:mm:ss"
    const locale  = 'en-US'       
    const zonaHoraria      = 'Europe/Madrid'
    
    const fechaInicioString = formatDate(fechaInicio, formatoFecha, locale, zonaHoraria)
    const fechaFinString    = formatDate(fechaFin,    formatoFecha, locale, zonaHoraria)

    this.sesionEntrenamiento.fecha_Inicio = fechaInicioString
    this.sesionEntrenamiento.fecha_Fin = fechaFinString
    this.sesionEntrenamiento.id_Cuerpo_Tecnico = this.cuerpoTecnico.ID
    this.sesionEntrenamiento.id_Equipo = this.cuerpoTecnico.equipo_id

    const tiempoDiferencia = fechaFin.getTime() - fechaInicio.getTime()
    this.diasSesion = Math.ceil(tiempoDiferencia / (1000 * 60 * 60 * 24)) + 1

    this.mostrarDiasSesion = true

    // this.servicioSesionEntrenamiento.crearSesionEntrenamiento(this.sesionEntrenamiento).subscribe({
    //   next: (sesionEntrenamiento : SesionEntrenamiento) => {
    //     console.log(sesionEntrenamiento.ID)
    //   }
    // })

  
    this.mostrarDiasSesion = true;
  
  }

  seleccionarEntrenamiento() {

  }

  /*
  * Metodo que muestra el array de alineaciones en el idioma 
  * seleccionado por el usuario
  */
  getTipoEntrenamiento(): string[] {
    return this.translate.currentLang === 'es' ? this.tiposEntrenamientoEsp : this.tiposEntrenamientoEng;
  }

  crearNuevoEntrenamiento() {
    this.nuevoEntrenamiento.id_cuerpo_tecnico = this.cuerpoTecnico.ID

  const d = this.nuevoEntrenamiento.duracion;
  const hh = String(d.hours).padStart(2, '0');
  const mm = String(d.minutes).padStart(2, '0');
  const duracionStr = `${hh}:${mm}:00`;    // e.g. "01:30:00"

      const payload = {
    tipo: this.nuevoEntrenamiento.tipo,
    descripcion: this.nuevoEntrenamiento.descripcion,
    duracion: duracionStr,
    id_cuerpo_tecnico: this.nuevoEntrenamiento.id_cuerpo_tecnico
  };

    this.servicioEntrenamiento.crearEntrenamiento(payload).subscribe({
      next: (entrenamiento : Entrenamiento) => {
        console.log(entrenamiento.ID)
      }
    })
  }

  establecerTipoNuevoEntrenamiento(tipo: string) {
    if(tipo === 'physical'){
      tipo = 'fisico'
    }else if(tipo === 'technical'){
      tipo = 'tecnico'
    }else if(tipo === 'tactical'){
      tipo = 'tactico'
    }else if(tipo === 'recovery'){
      tipo = 'recuperacion'
    }else if(tipo === 'gym'){
      tipo = 'gimnasio'
    }else if(tipo === 'pre-match'){
      tipo = 'prepartido'
    }
    this.nuevoEntrenamiento.tipo = tipo;
  }

}
