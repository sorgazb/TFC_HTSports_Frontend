import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuario';
import { ServicioUsuarioService } from '../services/servicio-usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Aficionado } from '../aficionado';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  usuario !: Usuario

  aficionado !: Aficionado

  formUsuario !: FormGroup

  formAficionado !: FormGroup

  mostrarPassword : boolean = false

  mostrarErrorRegistro : boolean = false

  mostrarUsuarioActualizado : boolean = false

  mostrarAficionadoActualizado : boolean = false

  mostrarErrorAficionado : boolean = false

  ngOnInit(): void {

    let usuarioAux = sessionStorage.getItem('usuario')
    let usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario

    let aficionadoAux = localStorage.getItem('aficionado')
    let aficionadoSesison = JSON.parse(aficionadoAux!)
    this.aficionado = aficionadoSesison

    this.formUsuario = new FormGroup({
      nombre: new FormControl(this.usuario.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      email : new FormControl(this.usuario.correo_electronico,[Validators.required, Validators.email]),
    })

    this.formAficionado = new FormGroup({
      telefono : new FormControl(this.aficionado.telefono, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$')]),
      direccion : new FormControl(this.aficionado.direccion, [Validators.required]),
      poblacion : new FormControl(this.aficionado.poblacion, [Validators.required]),
      codigoPostal : new FormControl(this.aficionado.codigo_postal, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]+$')])
    })


  }

  constructor(private seriviosUsuario : ServicioUsuarioService) { }

  public controlarErrores(nombreControl : string, nombreError : string){
    return this.formUsuario.controls[nombreControl].hasError(nombreError)
  }

  public controlarErroresAficionado(nombreControl : string, nombreError : string){
    return this.formAficionado.controls[nombreControl].hasError(nombreError)
  }

  obtenerImgPerfil(): string {
    if (this.usuario.avatar) {
      return this.usuario.avatar;
    }else{
      return 'https://www.w3schools.com/howto/img_avatar.png';
    }
  }

  actualizarDatosUsuario(){

    const datosUsuarioActualizar = {
      nombre: this.formUsuario.get('nombre')?.value,
      correo_electronico: this.formUsuario.get('email')?.value
    }

    this.seriviosUsuario.actualizarDatosUsuario(this.usuario.ID,datosUsuarioActualizar).subscribe({
      next: () => {
        this.mostrarUsuarioActualizado = true
      },
      error: (error) => {
        if(error.status == 400){
          this.mostrarErrorRegistro = true
        }
      }
    })
  }

  cambiarVisibilidadPassword(){
    this.mostrarPassword = !this.mostrarPassword
  }

  actualizarDatosAficionado(){
    const datosAficionadoActualizar = {
      telefono: this.formAficionado.get('telefono')?.value,
      direccion: this.formAficionado.get('direccion')?.value,
      poblacion: this.formAficionado.get('poblacion')?.value,
      codigo_postal: this.formAficionado.get('codigoPostal')?.value,
    }

    this.seriviosUsuario.actualizarDatosAficionado(this.aficionado.ID,datosAficionadoActualizar).subscribe({
      next: () => {
        this.mostrarAficionadoActualizado = true
      },
      error: (error) => {
        if(error.status == 400){
          this.mostrarErrorAficionado = true
        }
      }
    })
  }

  cerrarAlerta() {
    this.mostrarErrorRegistro = false
    this.mostrarUsuarioActualizado = false
    this.mostrarAficionadoActualizado = false
    this.mostrarErrorAficionado = false
  }


}
