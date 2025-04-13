import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioUsuarioService } from '../../services/servicio-usuario.service';
import { Usuario } from '../../class/usuario';
import { Router } from '@angular/router';
import { Aficionado } from '../../class/aficionado';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit{

  usuario !: Usuario
  aficionado !: Aficionado

  formLogin !: FormGroup

  mostrarPassword : boolean = false
  mostrarError : boolean = false

  constructor(private router: Router ,private serviciosUsuario: ServicioUsuarioService){}

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email : new FormControl('',[Validators.required, Validators.email]),
      password : new FormControl('',[Validators.required])
    })
  }

  /*
  * Metodo que comprueba si el input contiene algun error.
  * @param {string} => nombre del input a controlar.
  * @param {string} => nombre del error controlado.
  * @return {FormGroup.control} =>  devuelve si se comple un error.
  */
  public controlarErrores(nombreControl : string, nombreError : string){
    return this.formLogin.controls[nombreControl].hasError(nombreError)
  }

  /*
  * Metodo que oculta o muestra la contraseña en el input.
  */
  public cambiarVisibilidadPassword(){
    this.mostrarPassword = !this.mostrarPassword
  }

  /*
  * Metodo que inicia sesion, llama al servicio de logue crea una sesion para almacenar el Usuario,
  * redirigiendo al usuario a la pagina de inicio.
  * @return {error : 400} => error que devuelve la llamada al servicio en caso de que no exista ese correo electronico o contraseña.
  */
  public iniciarSesion(){
    this.usuario = new Usuario();
    this.usuario.correo_electronico = this.formLogin.get('email')?.value;
    this.usuario.password = this.formLogin.get('password')?.value; 
    
    const loginData = {
      correo_electronico: this.usuario.correo_electronico,
      password: this.usuario.password
    }
    
    this.serviciosUsuario.loguearUsuario(loginData).subscribe({
      next: (usuarioLogeado : Usuario) => {
        this.usuario = usuarioLogeado
        sessionStorage.setItem('token', usuarioLogeado.token)
        sessionStorage.setItem('usuario', JSON.stringify(this.usuario))
        
        let idUsuario = 0
        if(sessionStorage.getItem('usuario') != null){
          let usarioLogin = sessionStorage.getItem('usuario')
          let usuarioParseado = JSON.parse(usarioLogin!)
          idUsuario = usuarioParseado.usuario.ID          
        }
  
        this.serviciosUsuario.obtenerAficionado(idUsuario).subscribe((aficionadoObtenido: Aficionado) => {
          this.aficionado = aficionadoObtenido;
          localStorage.setItem('aficionado', JSON.stringify(this.aficionado));
          this.router.navigate(['/']).then(() => {
            window.location.reload()
          })
        })
      },
      error: (error) => {
        if(error.status == 400){
          this.mostrarError = true
        }
      }
    })
  }

  /*
  * Metodo para cerrar las alertas que aparecen en la ejecucion.
  */
  public cerrarAlerta(){
    this.mostrarError = false
  }

}
