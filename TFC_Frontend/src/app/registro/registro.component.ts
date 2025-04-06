import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Usuario } from '../usuario';
import { ServicioUsuarioService } from '../services/servicio-usuario.service';
import { Router } from '@angular/router';
import { Aficionado } from '../aficionado';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formRegistro!: FormGroup;
  mostrarPassword: boolean = false;
  passwordIguales: boolean = false;
  infoPassword: boolean = false;
  mostrarErrorPasswords: boolean = false;
  usuario!: Usuario;
  aficionado!: Aficionado;

  constructor(private serviciosUsuario: ServicioUsuarioService, private route: Router) { }

  ngOnInit(): void {
    this.formRegistro = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)]),
      validacionPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)])
    });
  }

  public controlarErrores(nombreControl: string, nombreError: string) {
    return this.formRegistro.controls[nombreControl].hasError(nombreError);
  }

  public cambiarVisibilidadPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }


  public registrarUsuario() {
    this.comprobarIgualdadPasswords(this.formRegistro);
    if (!this.passwordIguales) {
      this.mostrarErrorPasswords = true;
      return;
    }
  
    this.usuario = new Usuario();
    this.usuario.nombre = this.formRegistro.get('nombre')?.value;
    this.usuario.correo_electronico = this.formRegistro.get('email')?.value;
    this.usuario.password = this.formRegistro.get('password')?.value;  // Asegúrate de que se asigna correctamente la contraseña
    this.usuario.tipo = 'aficionado';
    this.usuario.edad = 0;
    this.usuario.posicion = '';
    this.usuario.equipo_id = 0;
    this.usuario.tipo_cuerpo_tecnico = '';
  
    console.log("Usuario a registrar: ", this.usuario); // Verifica si la contraseña está asignada
  
    // Registrar el usuario
    this.serviciosUsuario.registrarUsuario(this.usuario).subscribe((usuarioRegistrado: Usuario) => {
      console.log("Usuario registrado: ", usuarioRegistrado); // Verifica los datos registrados
  
      // Ahora asignamos correctamente la contraseña al login
      const loginData = {
        correo_electronico: usuarioRegistrado.correo_electronico,
        password: this.usuario.password  // Asegúrate de que la contraseña se pasa correctamente aquí
      };
  
      console.log("Datos de login: ", loginData); // Verifica si la contraseña ahora está presente
  
      this.serviciosUsuario.loguearUsuario(loginData)
        .subscribe((usuarioLogeado: Usuario) => {
          this.usuario = usuarioLogeado; // Este podría ser solo el token
          sessionStorage.setItem('token', usuarioLogeado.token); // Guarda el token
          sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
  
          // Obtener aficionado con el ID correcto
          this.serviciosUsuario.obtenerAficionado(usuarioRegistrado.ID).subscribe((aficionadoObtenido: Aficionado) => {
            this.aficionado = aficionadoObtenido;
            localStorage.setItem('aficionado', JSON.stringify(this.aficionado));
            this.route.navigate(['/']).then(() => {
              window.location.reload();
            });
          });
        });
    });
  }
  
  

  public comprobarIgualdadPasswords(formulario: FormGroup) {
    const password1 = formulario.get('password')?.value;
    const password2 = formulario.get('validacionPassword')?.value;

    // Verifica si las contraseñas coinciden
    if (password1 === password2) {
      this.passwordIguales = true;
    } else {
      this.passwordIguales = false;
    }
  }

  mostrarInfoPassword() {
    this.infoPassword = true;
  }

  ocultarInfoPassword() {
    this.infoPassword = false;
  }

  cerrarAlerta() {
    this.mostrarErrorPasswords = false;
  }
}
