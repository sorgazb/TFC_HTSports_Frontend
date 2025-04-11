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

  formLogin !: FormGroup

  mostrarPassword : boolean = false

  mostrarError : boolean = false

  usuario !: Usuario
  aficionado !: Aficionado

  constructor(private router: Router ,private serviciosUsuario: ServicioUsuarioService){}

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
        this.usuario = new Usuario();
        this.usuario.nombre = ''
        this.usuario.correo_electronico = this.formLogin.get('email')?.value;
        this.usuario.password = this.formLogin.get('password')?.value; 
        this.usuario.tipo = '';
        this.usuario.edad = 0;
        this.usuario.posicion = '';
        this.usuario.equipo_id = 0;
        this.usuario.tipo_cuerpo_tecnico = '';
      
        const loginData = {
          correo_electronico: this.usuario.correo_electronico,
          password: this.usuario.password
        };

        this.serviciosUsuario.loguearUsuario(loginData).subscribe({
          next: (usuarioLogeado : Usuario) => {
            this.usuario = usuarioLogeado
            sessionStorage.setItem('token', usuarioLogeado.token);
            sessionStorage.setItem('usuario', JSON.stringify(this.usuario));  
  
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
                window.location.reload();
              });
            });
          },
          error: (error) => {
            if(error.status == 400){
              this.mostrarError = true
            }
          }
        })

  }

  public cerrarAlerta(){
    this.mostrarError = false
  }

}
