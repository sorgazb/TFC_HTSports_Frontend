import { Country } from '@angular-material-extensions/select-country';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { JugadorOjeado } from 'src/app/class/jugador-ojeado';

@Component({
  selector: 'app-card-jugador-ojeado-registrar',
  templateUrl: './card-jugador-ojeado-registrar.component.html',
  styleUrls: ['./card-jugador-ojeado-registrar.component.css']
})
export class CardJugadorOjeadoRegistrarComponent implements OnInit{

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

    translate !: TranslateService;


  ngOnInit(): void {
    this.formNuevoJugador = new FormGroup({
      nombre: new FormControl(this.jugadorOjeado.nombre, [Validators.required]),
      posicion: new FormControl(this.jugadorOjeado.posicion, [Validators.required])
      // email : new FormControl(this.usuario.correo_electronico,[Validators.required, Validators.email]),
    })
  }

  constructor(public dialogRef: MatDialogRef<CardJugadorOjeadoRegistrarComponent>, @Inject(MAT_DIALOG_DATA) public data:any, translate: TranslateService){
    this.translate = translate
  }

  /*
  * Metodo que comprueba si el input contiene algun error.
  * @param {string} => nombre del input a controlar.
  * @param {string} => nombre del error controlado.
  * @return {FormGroup.control} =>  devuelve si se comple un error.
  */
  public controlarErrores(nombreControl : string, nombreError : string){
    return this.formNuevoJugador.controls[nombreControl].hasError(nombreError)
  }

  /*
  * Metodo que obtiene la foto de la base de datos y la transforma a un formato utilizable en el frontend.
  */
  obtenerImgPerfil() {
    return 'data:image/png;base64,'+this.jugadorOjeado.avatar
  }

  /*
  * Metodo que renderiza la imagen seleccionada por el usuario.
  */
  cambiasImagen(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenASubir = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenSeleccionada = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  registrarJugador(){

  }

  onCountrySelected(country: Country) {
    this.jugadorOjeado.nacionalidad = country.alpha2Code.toLowerCase()
  }
}
