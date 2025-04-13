import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../class/usuario';
import { ServicioUsuarioService } from '../../services/servicio-usuario.service';
import { Router } from '@angular/router';
import { Aficionado } from '../../class/aficionado';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario!: Usuario
  aficionado!: Aficionado

  formRegistro!: FormGroup

  mostrarPassword: boolean = false
  passwordIguales: boolean = false
  infoPassword: boolean = false
  mostrarErrorPasswords: boolean = false
  mostrarErrorRegistro : boolean = false

  constructor(private serviciosUsuario: ServicioUsuarioService, private route: Router) { }

  ngOnInit(): void {
    this.formRegistro = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
      validacionPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)])
    })
  }

  /*
  * Metodo que comprueba si el input contiene algun error.
  * @param {string} => nombre del input a controlar.
  * @param {string} => nombre del error controlado.
  * @return {FormGroup.control} =>  devuelve si se comple un error.
  */
  public controlarErrores(nombreControl: string, nombreError: string) {
    return this.formRegistro.controls[nombreControl].hasError(nombreError)
  }

  /*
  * Metodo que oculta o muestra la contraseña en el input.
  */
  public cambiarVisibilidadPassword() {
    this.mostrarPassword = !this.mostrarPassword
  }

  /*
  * Metodo que registra al usuario, en caso de error en las contraseñas la funcion para,
  * si no, llama al servicio de resgitrar usario, en caso de que exista el correo electronico
  * devuelve error, si no llama al servicio de logue crea una sesion para almacenar el Usuario,
  * redirigiendo al usuario a la pagina de inicio.
  * @return {boolean} => en caso de las contraseñas no coincidan.
  * @return {error : 400} => error que devuelve la llamada al servicio en caso de que exista ese correo electronico.
  */
  public registrarUsuario() {

    this.comprobarIgualdadPasswords(this.formRegistro)
    if (!this.passwordIguales) {
      this.mostrarErrorPasswords = true
      return
    }
  
    this.usuario = new Usuario()
    this.usuario.nombre = this.formRegistro.get('nombre')?.value
    this.usuario.correo_electronico = this.formRegistro.get('email')?.value
    this.usuario.password = this.formRegistro.get('password')?.value
    this.usuario.tipo = 'aficionado'

    this.serviciosUsuario.registrarUsuario(this.usuario).subscribe({
      next: (usuarioRegistrado : Usuario) => {
        const loginData = {
          correo_electronico: usuarioRegistrado.correo_electronico,
          password: this.usuario.password
        }
        
        this.serviciosUsuario.loguearUsuario(loginData).subscribe((usuarioLogeado: Usuario) => {
          this.usuario = usuarioLogeado
          sessionStorage.setItem('token', usuarioLogeado.token)
          sessionStorage.setItem('usuario', JSON.stringify(this.usuario))
          
          this.serviciosUsuario.obtenerAficionado(usuarioRegistrado.ID).subscribe((aficionadoObtenido: Aficionado) => {
            this.aficionado = aficionadoObtenido
            localStorage.setItem('aficionado', JSON.stringify(this.aficionado))
            this.route.navigate(['/']).then(() => {
              window.location.reload()
            })
          })
        })
      },
      error: (error) => {
        if(error.status == 400){
          this.mostrarErrorRegistro = true
        }
      }
    })
  }
  
  /*
  * Metodo que comprueba que las contraseñas del formulario sean iguales.
  * @param {FormGroup} => formulario de registro
  */
  public comprobarIgualdadPasswords(formulario: FormGroup) {
    const password1 = formulario.get('password')?.value
    const password2 = formulario.get('validacionPassword')?.value

    if (password1 == password2) {
      this.passwordIguales = true
    } else {
      this.passwordIguales = false
    }
  }

  /*
  * Metodo que muestra el texto de ayuda del formato de contraseña
  * cuando el foco esta en input de contraseña.
  */
  mostrarInfoPassword() {
    this.infoPassword = true
  }

  /*
  * Metodo que oculta el texto de ayuda del formato de contraseña
  * cuando el foco no esta en input de contraseña.
  */
  ocultarInfoPassword() {
    this.infoPassword = false
  }

  /*
  * Metodo para cerrar las alertas que aparecen en la ejecucion.
  */
  cerrarAlerta() {
    this.mostrarErrorPasswords = false
    this.mostrarErrorRegistro = false
  }
}
