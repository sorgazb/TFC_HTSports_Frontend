import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
    FechaInicio : '',
    FechaFin : '',
    DetallesSesion: []
  }

  nuevoEntrenamiento : Entrenamiento = {
    ID : 0,
    id_cuerpo_tecnico : 0,
    descripcion : '',
    tipo : '',
    duracion : {hours : 0, minutes: 0}
  }

  entrenamientosEquipo : Entrenamiento [] = []
  entrenamientosSesion : DetalleSesion [] = []

  formNuevaSesion !: FormGroup
  translate !: TranslateService

  idSesion !: number

  idEntrenamientoSeleccionado: number[] = []
  
  usarEntrenamiento : boolean = false
  mostrarDiasSesion : boolean = false
  mostrarSelectorFechaSesion: boolean = true
  
  diasSesion !: number
  
  tiposEntrenamientoEsp = ['fisico', 'tecnico', 'tactico', 'recuperacion', 'gimnasio', 'prepartido']
  tiposEntrenamientoEng = ['physical', 'technical', 'tactical', 'recovery', 'gym', 'pre-match']

  fechasDias: string[] = []
  fechasInvalidas: boolean[] = []
  mostrarDia: boolean[] = []

  fechaInicioString = ''
  fechaFinString    = ''

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

    this.servicioEntrenamiento.obtenerEntrenamientoEquipo(this.cuerpoTecnico.equipo_id).subscribe((entrenamientos : Entrenamiento[])=>{
      this.entrenamientosEquipo = entrenamientos
    })
  }

  constructor(public dialogRef: MatDialogRef<CardSesionEntrenamientoRegistrarComponent>, @Inject(MAT_DIALOG_DATA) public data:any, translate : TranslateService, private servicioSesionEntrenamiento : ServicioSesionEntrenamientoService, private servicioEntrenamiento : ServicioEntrenamientoService){
    this.translate = translate
  }

  /*
  * Metodo que compara si el rango de fechas es correcto
  * y si la fecha de inicio es mayor a la fecha actual
  * @param group
  * @returns ValidationErrors | null
  */
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

  /*
  * Metodo que crea los detalles de la sesion de entrenamiento y carga la estructura
  * HTML para mostrar y establcer los entrenamientos correspondientes a cada dia de 
  * la sesion
  */
  establecerEntrenamientosSesion(){
    const fechaInicio: Date = this.formNuevaSesion.get('rangoFechas.fechaInicio')!.value
    const fechaFin:    Date = this.formNuevaSesion.get('rangoFechas.fechaFin')!.value
    
    const formatoFecha = "yyyy-MM-dd'T'HH:mm:ss"
    const locale  = 'en-US'       
    const zonaHoraria      = 'Europe/Madrid'
    
    const fechaInicioString = formatDate(fechaInicio, formatoFecha, locale, zonaHoraria)
    const fechaFinString    = formatDate(fechaFin,    formatoFecha, locale, zonaHoraria)

    this.sesionEntrenamiento.FechaInicio = fechaInicioString
    this.sesionEntrenamiento.FechaFin = fechaFinString
    this.sesionEntrenamiento.id_Cuerpo_Tecnico = this.cuerpoTecnico.ID
    this.sesionEntrenamiento.id_Equipo = this.cuerpoTecnico.equipo_id

    const tiempoDiferencia = fechaFin.getTime() - fechaInicio.getTime()
    this.diasSesion = Math.ceil(tiempoDiferencia / (1000 * 60 * 60 * 24)) + 1

    this.fechasDias = Array(this.diasSesion).fill('')
    this.fechasInvalidas = Array(this.diasSesion).fill(false)
    this.mostrarDia       = Array(this.diasSesion).fill(true)

    const fechaInicioDate: Date = this.formNuevaSesion.get('rangoFechas.fechaInicio')!.value
    const fechaFinDate: Date = this.formNuevaSesion.get('rangoFechas.fechaFin')!.value
    this.fechaInicioString = this.fechaAString(fechaInicioDate)
    this.fechaFinString    = this.fechaAString(fechaFinDate)


    this.servicioSesionEntrenamiento.crearSesionEntrenamiento(this.sesionEntrenamiento).subscribe({
      next: (sesionEntrenamiento : SesionEntrenamiento) => {
        this.idSesion = sesionEntrenamiento.ID
        this.mostrarSelectorFechaSesion = false
      }
    })

    this.mostrarDiasSesion = true
  }

  /*
  * Metodo que se encarga de obtener el id del entrenamiento existente seleccionado
  * y asignarlo al detalle de la sesion de entrenamiento
  * @param {index} => indice del entrenamiento seleccionado
  */
  seleccionarEntrenamiento(index : number) {
    const idEntrenamiento = this.idEntrenamientoSeleccionado[index]
    if (idEntrenamiento) this.asignarDetalle(index, idEntrenamiento)
  }

  /*
  * Metodo que muestra el array de tipos de entrenamiento en el idioma 
  * seleccionado por el usuario
  */
  getTipoEntrenamiento(): string[] {
    return this.translate.currentLang === 'es' ? this.tiposEntrenamientoEsp : this.tiposEntrenamientoEng
  }

  /*
  * Metodo que se encarga de crear un nuevo entrenamiento para el dia seleccionado por
  * el usuario, y en caso de exito lo asigna al detalle de la sesion de entrenamiento
  * @param {index} => indice del dia seleccionado
  */
  crearNuevoEntrenamiento(index : number) {
    
    this.nuevoEntrenamiento.id_cuerpo_tecnico = this.cuerpoTecnico.ID
    
    const duracion = this.nuevoEntrenamiento.duracion
    const horas = String(duracion.hours).padStart(2, '0')
    const minutos = String(duracion.minutes).padStart(2, '0')
    const duracionString = `${horas}:${minutos}:00`
    
    const datosEntrenamiento = {
      tipo: this.nuevoEntrenamiento.tipo,
      descripcion: this.nuevoEntrenamiento.descripcion,
      duracion: duracionString,
      id_cuerpo_tecnico: this.nuevoEntrenamiento.id_cuerpo_tecnico
    }
    
    this.servicioEntrenamiento.crearEntrenamiento(datosEntrenamiento).subscribe({
      next: (entrenamiento : Entrenamiento) => {
        this.asignarDetalle(index, entrenamiento.ID)
        this.nuevoEntrenamiento = { ID:0, id_cuerpo_tecnico:0, tipo:'', descripcion:'', duracion:{hours:0,minutes:0} }
      }
    })

    this.servicioEntrenamiento.obtenerEntrenamientoEquipo(this.cuerpoTecnico.equipo_id).subscribe((entrenamientos : Entrenamiento[])=>{
      this.entrenamientosEquipo = entrenamientos
    })
  }

  /*
  * Metodo que se encarga de asignar al array de detalles el id del entrenamiento
  * seleccionado por el usuario.
  * @param {index} => indice del dia seleccionado
  * @param {idEntrenamiento} => id del entrenamiento seleccionado
  */
  asignarDetalle(index : number, idEntrenamiento : number) {
    this.entrenamientosSesion[index] = {
      id:0,
      id_Sesion_Entrenamiento: this.idSesion,
      id_Entrenamiento: Number(idEntrenamiento),
      fecha: new Date(this.fechasDias[index])
    }
    this.mostrarDia[index] = false
  }

  /*
  * Metodo que establece al nuevo entrenamiento el tipo seleccionado por el usuario
  * @param {tipo} => tipo de entrenamiento seleccionado por el usuario
  */
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
    this.nuevoEntrenamiento.tipo = tipo
  }


  /*
  * Metodo que convierte la fecha seleccionada a string
  * @param {fecha} => fecha seleccionada por el usuario
  */
  fechaAString(fecha: Date): string {
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}`
  }

  /*
  * Metodo que se encarga de validar si la fecha seleccionada por el usuario
  * esta dentro del rango de fechas de la sesion
  * @param {fecha} => fecha seleccionada por el usuario
  */
  validarFecha(fecha: number) {
    const fechaAValidar = this.fechasDias[fecha]
    if (!fechaAValidar) {
      this.fechasInvalidas[fecha] = false
      return
    }
    const fechaValidar = new Date(fechaAValidar)
    const inicio = new Date(this.fechaInicioString)
    const fin = new Date(this.fechaFinString)
    this.fechasInvalidas[fecha] = (fechaValidar < inicio || fechaValidar > fin)
  }

  /*
  * Metodo el cual se encarga de guardar los detalles de la sesion de entrenamiento
  */
  guardarSesionCompleta() {
    this.servicioSesionEntrenamiento.agregarEntrenamientosSesion(this.entrenamientosSesion, this.idSesion).subscribe(()=>{
      this.dialogRef.close(true)
    })
  }
}
