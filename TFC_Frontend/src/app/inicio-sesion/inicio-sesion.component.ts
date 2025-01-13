import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit{

  formLogin !: FormGroup

  mostrarPassword : boolean = false

  mostrarError : boolean = false

  constructor(){}

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email : new FormControl('',[Validators.required, Validators.email]),
      password : new FormControl('',[Validators.required])
    })
  }

  public controlarErrores(nombreControl : string, nombreError : string){
    return this.formLogin.controls[nombreControl].hasError(nombreError)
  }

  public cambiarVisibilidadPassword(){
    this.mostrarPassword = !this.mostrarPassword
  }

  public iniciarSesion(){
    this.mostrarError = true
  }
}
