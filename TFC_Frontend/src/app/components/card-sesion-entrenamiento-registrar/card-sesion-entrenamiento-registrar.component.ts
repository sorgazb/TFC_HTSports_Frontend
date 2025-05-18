import { formatDate, Time } from '@angular/common';
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
  
  idSesion !: number

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

  selectedEntrenamientoId: number[] = [];
  
  usarEntrenamiento : boolean = false

  diasSesion !: number

  mostrarDiasSesion : boolean = false

  formNuevaSesion !: FormGroup

  translate !: TranslateService

  tiposEntrenamientoEsp = ['fisico', 'tecnico', 'tactico', 'recuperacion', 'gimnasio', 'prepartido']
  tiposEntrenamientoEng = ['physical', 'technical', 'tactical', 'recovery', 'gym', 'pre-match']

  // Arrays paralelos al número de días:
  fechasDias: string[] = [];
  fechasInvalidas: boolean[] = [];

  // Cadenas ISO localizadas sin hora (para min/max del input)
  fechaInicioStr = '';
  fechaFinStr    = '';

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

    this.sesionEntrenamiento.FechaInicio = fechaInicioString
    this.sesionEntrenamiento.FechaFin = fechaFinString
    this.sesionEntrenamiento.id_Cuerpo_Tecnico = this.cuerpoTecnico.ID
    this.sesionEntrenamiento.id_Equipo = this.cuerpoTecnico.equipo_id

    const tiempoDiferencia = fechaFin.getTime() - fechaInicio.getTime()
    this.diasSesion = Math.ceil(tiempoDiferencia / (1000 * 60 * 60 * 24)) + 1

    // Prepara arrays a la longitud correcta:
    this.fechasDias = Array(this.diasSesion).fill('');
    this.fechasInvalidas = Array(this.diasSesion).fill(false);

    // Guarda fechaInicioStr/fechaFinStr como 'yyyy-MM-dd':
    const fi: Date = this.formNuevaSesion.get('rangoFechas.fechaInicio')!.value;
    const ff: Date = this.formNuevaSesion.get('rangoFechas.fechaFin')!.value;
    this.fechaInicioStr = this.toDateInputString(fi);
    this.fechaFinStr    = this.toDateInputString(ff);


    this.mostrarDiasSesion = true

    this.servicioSesionEntrenamiento.crearSesionEntrenamiento(this.sesionEntrenamiento).subscribe({
      next: (sesionEntrenamiento : SesionEntrenamiento) => {
        this.idSesion = sesionEntrenamiento.ID
      }
    })

    this.mostrarDiasSesion = true;  
  }

  seleccionarEntrenamiento(i : number) {
        const idEntr = this.selectedEntrenamientoId[i];
    if (idEntr) this.asignarDetalle(i, idEntr);

    console.log(this.entrenamientosSesion)
  }

  /*
  * Metodo que muestra el array de alineaciones en el idioma 
  * seleccionado por el usuario
  */
  getTipoEntrenamiento(): string[] {
    return this.translate.currentLang === 'es' ? this.tiposEntrenamientoEsp : this.tiposEntrenamientoEng;
  }

  crearNuevoEntrenamiento(i: number) {
    
    this.nuevoEntrenamiento.id_cuerpo_tecnico = this.cuerpoTecnico.ID
    
    const d = this.nuevoEntrenamiento.duracion;
    const hh = String(d.hours).padStart(2, '0');
    const mm = String(d.minutes).padStart(2, '0');
    const duracionStr = `${hh}:${mm}:00`;
    
    const payload = {
      tipo: this.nuevoEntrenamiento.tipo,
      descripcion: this.nuevoEntrenamiento.descripcion,
      duracion: duracionStr,
      id_cuerpo_tecnico: this.nuevoEntrenamiento.id_cuerpo_tecnico
    };
    
    this.servicioEntrenamiento.crearEntrenamiento(payload).subscribe({
      next: (entrenamiento : Entrenamiento) => {
        this.asignarDetalle(i, entrenamiento.ID);
        this.nuevoEntrenamiento = { ID:0, id_cuerpo_tecnico:0, tipo:'', descripcion:'', duracion:{hours:0,minutes:0} };
      }
    })
  }

  asignarDetalle(i: number, idEntr: number) {
    this.entrenamientosSesion[i] = {
      id:0,
      id_Sesion_Entrenamiento: this.idSesion,
      id_Entrenamiento: Number(idEntr),
      fecha: new Date(this.fechasDias[i])
    };
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


  /** Convierte Date a 'yyyy-MM-dd' para el input[type=date] */
  toDateInputString(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /** Valida la fecha elegida para el día i */
  validarFecha(i: number) {
    const val = this.fechasDias[i];
    if (!val) {
      this.fechasInvalidas[i] = false;
      return;
    }
    const d = new Date(val);
    const inicio = new Date(this.fechaInicioStr);
    const fin    = new Date(this.fechaFinStr);
    this.fechasInvalidas[i] = (d < inicio || d > fin);
  }

  /**  
 * Llama primero a crear la sesión (POST a /api/sesisonesEntrenamiento),
 * luego, con el ID que devuelve, agrega los detalles de entrenamiento
 * (POST a /api/sesisonesEntrenamiento/{id}/entrenamientos).
 */
guardarSesionCompleta() {
  console.log('Datos que se enviarán al backend:', this.entrenamientosSesion);
  console.log('ID de la sesión:', this.idSesion);

  this.servicioSesionEntrenamiento.agregarEntrenamientosSesion(this.entrenamientosSesion, this.idSesion)
  .subscribe({
    next: () => {
      console.log('Sesión y entrenamientos guardados correctamente.');
      this.dialogRef.close(true); // Cierra el modal y devuelve éxito
    },
    error: err => {
      console.error('Error al guardar los entrenamientos:', err);
    }
  });
}



}
