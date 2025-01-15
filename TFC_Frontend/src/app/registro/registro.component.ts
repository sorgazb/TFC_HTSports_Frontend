import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit{

  formRegistro !: FormGroup

  mostrarPassword : boolean = false

  passwordIguales : boolean = false

  infoPassword : boolean = false

  mostrarErrorPasswords : boolean = false

  constructor(){}

  ngOnInit(): void {
    this.formRegistro = new FormGroup({
      nombre : new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$')]),
      email : new FormControl('',[Validators.required, Validators.email]),
      password : new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
      validacionPassword : new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)])
    })
  }

  public controlarErrores(nombreControl : string, nombreError : string){
    return this.formRegistro.controls[nombreControl].hasError(nombreError)
  }

  public cambiarVisibilidadPassword(){
    this.mostrarPassword = !this.mostrarPassword
  }

  public registrarUsuario(){
    this.comprobarIgualdadPasswords(this.formRegistro)
    if(!this.passwordIguales){
      this.mostrarErrorPasswords = true
    }
  }

  public comprobarIgualdadPasswords(formulario : FormGroup){
    const password1 = formulario.get('password')?.value
    const password2 = formulario.get('validacionPassword')?.value

    if(password1 === password2){
      this.passwordIguales = true
    }
  }

  mostrarInfoPassword() {
    this.infoPassword = true
  }

  ocultarInfoPassword(){
    this.infoPassword = false
  }

  cerrarAlerta (){
    this.mostrarErrorPasswords = false
  }

    
}
