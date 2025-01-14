import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit{

  formRegistro !: FormGroup

  mostrarPassword : boolean = false


  constructor(){}

  ngOnInit(): void {
    this.formRegistro = new FormGroup({
      nombre : new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$')]),
      email : new FormControl('',[Validators.required, Validators.email]),
      password : new FormControl('',[Validators.required]),
      validacionPassword : new FormControl('',[Validators.required])
    })
  }

  public controlarErrores(nombreControl : string, nombreError : string){
    return this.formRegistro.controls[nombreControl].hasError(nombreError)
  }

  public cambiarVisibilidadPassword(){
    this.mostrarPassword = !this.mostrarPassword
  }

  registrarUsuario(){

  }
}
