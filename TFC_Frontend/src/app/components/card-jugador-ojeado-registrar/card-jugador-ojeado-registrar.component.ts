import { Country } from '@angular-material-extensions/select-country';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { JugadorOjeado } from 'src/app/class/jugador-ojeado';
import { ServicioJugadorOjeadoService } from 'src/app/services/servicio-jugador-ojeado.service';
import { ServicioUsuarioService } from 'src/app/services/servicio-usuario.service';

@Component({
  selector: 'app-card-jugador-ojeado-registrar',
  templateUrl: './card-jugador-ojeado-registrar.component.html',
  styleUrls: ['./card-jugador-ojeado-registrar.component.css']
})

export class CardJugadorOjeadoRegistrarComponent implements OnInit{

  cuerpoTecnico !: CuerpoTecnico

  jugadorOjeado : JugadorOjeado = {
    id : 0,
    id_Cuerpo_Tecnico : 0,
    nombre : '',
    avatar : new File([], ''),
    edad : 0,
    posicion : '',
    descripcion : '',
    valoracion : 0,
    valoracion_portero : 0,
    valoracion_fisico : 0,
    valoracion_regate : 0,
    valoracion_pase : 0,
    valoracion_defensa : 0,
    valoracion_ataque : 0,
    nacionalidad : ''
  }

  formNuevoJugador !: FormGroup

  imagenASubir: File | null = null

  imagenSeleccionada: string | ArrayBuffer | null = null

  posiciones = ['Portero', 'Defensa', 'Centrocampista', 'Delantero']
  posicionesEng = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

  translate !: TranslateService

  fotoValidada: boolean = false

  fotoNoValidada: boolean = false

  cargando: boolean = false

  ngOnInit(): void {

    let cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    let cuerpoTecnicoSesion = JSON.parse(cuerpoTecnicoAux!)
    this.cuerpoTecnico = cuerpoTecnicoSesion

    this.formNuevoJugador = new FormGroup({
      nombre: new FormControl(this.jugadorOjeado.nombre, [Validators.required]),
      edad: new FormControl(this.jugadorOjeado.edad, [Validators.required]),
      posicion: new FormControl(this.jugadorOjeado.posicion, [Validators.required]),
      descripcion: new FormControl(this.jugadorOjeado.descripcion, [Validators.required]),
      nacionalidad: new FormControl(this.jugadorOjeado.nacionalidad, [Validators.required]),
      valoracion_ataque:    new FormControl(2.5),
      valoracion_defensa:    new FormControl(2.5),
      valoracion_pase:    new FormControl(2.5),
      valoracion_regate:    new FormControl(2.5),
      valoracion_fisico:    new FormControl(2.5),
      valoracion_portero:    new FormControl(2.5)
    })
  }

  constructor(public dialogRef: MatDialogRef<CardJugadorOjeadoRegistrarComponent>, @Inject(MAT_DIALOG_DATA) public data:any, translate: TranslateService,
   private servcioJugadorOjeado : ServicioJugadorOjeadoService, private serviciosUsuario : ServicioUsuarioService){
    this.translate = translate
  }

  /*
  * Metodo que renderiza la imagen seleccionada por el usuario.
  */
  cambiasImagen(event: any) {
    this.cargando = true
    const file: File = event.target.files[0]
    if (file) {
      this.imagenASubir = file
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenSeleccionada = reader.result
      }
      reader.readAsDataURL(file)
      this.serviciosUsuario.comprobarImagenWEB(file).subscribe({
        next: resp => {
          this.fotoValidada = true
          this.cargando = false
        },
        error: err =>{
          this.fotoNoValidada = true
          this.cargando = false
        } 
      })
    }
  }

  /*
  * Metodo el cual se encarga de recopilar los datos del formulario
  * de registro del nuevo jugador ojeado y los recopila en un
  * formData para hacer una llamada al servicio de registrar jugador ojeado
  */
  registrarJugador() {
    const datos = this.formNuevoJugador.value
    
    if (datos.posicion === 'portero' || datos.posicion === 'goalkeeper') {
      this.jugadorOjeado.posicion = 'portero'
    } else if (datos.posicion === 'defensa' || datos.posicion === 'defender') {
      this.jugadorOjeado.posicion = 'defensa'
    } else if (datos.posicion === 'centrocampista' || datos.posicion === 'midfielder') {
      this.jugadorOjeado.posicion = 'centrocampista'
    } else if (datos.posicion === 'delantero' || datos.posicion === 'forward') {
      this.jugadorOjeado.posicion = 'delantero'
    }
    
    this.calcularValoracionMedia()
    
    const formData = new FormData()
    formData.append('id_Cuerpo_Tecnico', this.cuerpoTecnico.ID.toString())
    formData.append('nombre', datos.nombre)
    formData.append('edad', datos.edad.toString())
    formData.append('posicion', this.jugadorOjeado.posicion)
    formData.append('descripcion', datos.descripcion)
    formData.append('nacionalidad', datos.nacionalidad.alpha2Code.toLowerCase())

    formData.append('valoracion',     this.jugadorOjeado.valoracion.toString())
    formData.append('valoracion_ataque',   datos.valoracion_ataque.toString())
    formData.append('valoracion_defensa',  datos.valoracion_defensa.toString())
    formData.append('valoracion_pase',     datos.valoracion_pase.toString())
    formData.append('valoracion_regate',   datos.valoracion_regate.toString())
    formData.append('valoracion_fisico',   datos.valoracion_fisico.toString())
    formData.append('valoracion_portero',  datos.valoracion_portero.toString())
    
    if (this.imagenASubir) {
      formData.append('avatar', this.imagenASubir, this.imagenASubir.name)
    }
    
    this.servcioJugadorOjeado.crearJugadorOjeado(formData).subscribe(()=>{
      this.dialogRef.close()
    })
  }

  /*
  * Metodo que asigna la nacionalidad al jugador una vez se selecciona
  * un pais en el select de paises
  */
  onCountrySelected(country: Country) {
    this.jugadorOjeado.nacionalidad = country.alpha2Code.toLowerCase()
  }

  /*
  * Metodo que muestra el array de alineaciones en el idioma 
  * seleccionado por el usuario
  */
  getPosiciones(): string[] {
    return this.translate.currentLang === 'es' ? this.posiciones : this.posicionesEng
  }

  /*
  * Metodo que asigna el campo valoracion del jugador nuevo ojeado
  * en funcion de una media relativa a las otras valoraciones y
  * a la posicion que ocupa en el campo
  */
  calcularValoracionMedia(){
    const datosJugador = this.formNuevoJugador.value
    
    const ataque   = datosJugador.valoracion_ataque
    const defensa  = datosJugador.valoracion_defensa
    const pase     = datosJugador.valoracion_pase
    const regate   = datosJugador.valoracion_regate
    const fisico   = datosJugador.valoracion_fisico
    
    const posicion = this.jugadorOjeado.posicion
    
    let totalPonderado = 0
    let sumaPesos = 0
    
    const datosMedia = (valor: number, peso: number) => {
      totalPonderado += valor * peso
      sumaPesos += peso
    }
    
    if (posicion === 'delantero') {
      datosMedia(ataque, 1 + 1.5)
      datosMedia(regate, 1 + 1.5)
      datosMedia(defensa, 1 - 0.5)
      datosMedia(pase, 1)
      datosMedia(fisico, 1)
    }else if (posicion === 'centrocampista') {
      datosMedia(ataque, 1)
      datosMedia(regate, 1 + 1.5)
      datosMedia(defensa, 1)
      datosMedia(pase, 1 + 1.5)
      datosMedia(fisico, 1)
    }else if (posicion === 'defensa') {
      datosMedia(ataque, 1 - 0.5)
      datosMedia(regate, 1)
      datosMedia(defensa, 1 + 1.5)
      datosMedia(pase, 1)
      datosMedia(fisico, 1 + 1.5)
    }
    
    let media = totalPonderado / sumaPesos
    media = Math.min(5, Math.max(0, parseFloat(media.toFixed(2))))
    media = Math.round(media * 2) / 2
    this.jugadorOjeado.valoracion = media
  }
}
