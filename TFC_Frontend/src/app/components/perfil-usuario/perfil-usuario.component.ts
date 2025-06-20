import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../class/usuario';
import { ServicioUsuarioService } from '../../services/servicio-usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Aficionado } from '../../class/aficionado';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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
  mostrarErrorNumCaras : boolean = false
  mostrarErrorFaceAPI : boolean = false

  usuarioSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null)
  aficionadoSubject: BehaviorSubject<Aficionado | null> = new BehaviorSubject<Aficionado | null>(null)

  imagenASubir: File | null = null

  imagenSeleccionada: string | ArrayBuffer | null = null

  fotoValidada: boolean = false

  fotoNoValidada: boolean = false

  cargando: boolean = false

  ngOnInit(): void {
    
    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }

    if(!localStorage.getItem('aficionado')){
      this.router.navigate(['/error'])
    }

    let usuarioAux = sessionStorage.getItem('usuario')
    let usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario
    this.usuarioSubject.next(this.usuario)

    let aficionadoAux = localStorage.getItem('aficionado')
    let aficionadoSesison = JSON.parse(aficionadoAux!)
    this.aficionado = aficionadoSesison
    this.aficionadoSubject.next(this.aficionado)

    this.formUsuario = new FormGroup({
      nombre: new FormControl(this.usuario.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]),
      email : new FormControl(this.usuario.correo_electronico,[Validators.required, Validators.email]),
    })

    this.usuarioSubject.subscribe(usarioSesionActualizado => {
      if(usarioSesionActualizado){
        this.usuario = usarioSesionActualizado
        if(this.formUsuario){
          this.formUsuario.patchValue({
            nombre: this.usuario.nombre,
            email: this.usuario.correo_electronico
          })
        }
      }
    })

    this.formAficionado = new FormGroup({
      telefono : new FormControl(this.aficionado.telefono, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$')]),
      direccion : new FormControl(this.aficionado.direccion, [Validators.required]),
      poblacion : new FormControl(this.aficionado.poblacion, [Validators.required]),
      codigoPostal : new FormControl(this.aficionado.codigo_postal, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]+$')])
    })

    this.aficionadoSubject.subscribe(aficionadoActualizado => {
      if(aficionadoActualizado){
        this.aficionado = aficionadoActualizado
        if(this.formAficionado){
          this.formAficionado.patchValue({
            telefono: this.aficionado.telefono,
            direccion: this.aficionado.direccion,
            poblacion: this.aficionado.poblacion,
            codigoPostal: this.aficionado.codigo_postal
          })
        }
      }
    })
  }

  constructor(private seriviosUsuario : ServicioUsuarioService, private router : Router) { }

  /*
  * Metodo que comprueba si el input contiene algun error.
  * @param {string} => nombre del input a controlar.
  * @param {string} => nombre del error controlado.
  * @return {FormGroup.control} =>  devuelve si se comple un error.
  */
  public controlarErrores(nombreControl : string, nombreError : string){
    return this.formUsuario.controls[nombreControl].hasError(nombreError)
  }

  /*
  * Metodo que comprueba si el input contiene algun error.
  * @param {string} => nombre del input a controlar.
  * @param {string} => nombre del error controlado.
  * @return {FormGroup.control} =>  devuelve si se comple un error.
  */
  public controlarErroresAficionado(nombreControl : string, nombreError : string){
    return this.formAficionado.controls[nombreControl].hasError(nombreError)
  }

  /*
  * Metodo que obtiene la foto de la base de datos y la transforma a un formato utilizable en el frontend.
  */
  obtenerImgPerfil() {
    return 'data:image/png;base64,'+this.usuario.avatar
  }
  
  /*
  * Metodo que actualiza los datos del usuario y actualiza la session.
  */
  actualizarDatosUsuario() {
    const datosUsuarioActualizar = {
      nombre: this.formUsuario.get('nombre')?.value,
      correo_electronico: this.formUsuario.get('email')?.value
    }
    
    if (this.imagenASubir) {
      this.seriviosUsuario.comprobarImagenWEB(this.imagenASubir).subscribe({
        next: resp => {
          this.fotoValidada = true
          this.cargando = false
          if(resp.count == 1){
            const formData = new FormData();
            formData.append('nombre', datosUsuarioActualizar.nombre)
            formData.append('correo_electronico', datosUsuarioActualizar.correo_electronico)
            formData.append('avatar', this.imagenASubir!)
    
            this.seriviosUsuario.actualizarDatosUsuario(this.usuario.ID, formData).subscribe({
              next: () => {
                this.mostrarUsuarioActualizado = true
                this.usuario = {
                  ...this.usuario,
                  ...datosUsuarioActualizar,
                  avatar: this.imagenASubir!
                }
                this.usuarioSubject.next(this.usuario)
                sessionStorage.setItem('usuario', JSON.stringify({ usuario: this.usuario }))
              },
              error: (error) => {
                if (error.status === 400) {
                  this.mostrarErrorRegistro = true
                }
              }
            });
          }else{
            this.mostrarErrorNumCaras = true
          }
        },
        error: err =>{
          this.fotoNoValidada = true
          this.cargando = false
        } 
      })
    } else {
      const formData = new FormData();
      formData.append('nombre', datosUsuarioActualizar.nombre)
      formData.append('correo_electronico', datosUsuarioActualizar.correo_electronico)
  
      this.seriviosUsuario.actualizarDatosUsuario(this.usuario.ID, formData).subscribe({
        next: () => {
          this.mostrarUsuarioActualizado = true
          this.usuario = { ...this.usuario, ...datosUsuarioActualizar }
          this.usuarioSubject.next(this.usuario)
          sessionStorage.setItem('usuario', JSON.stringify({ usuario: this.usuario }))
        },
        error: (error) => {
          if (error.status === 400) {
            this.mostrarErrorRegistro = true
          }
        }
      });
    }
  }

  /*
  * Metodo que actualiza los datos del aficionado y actualiza el localStorage.
  */
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

        this.aficionado.telefono = datosAficionadoActualizar.telefono
        this.aficionado.direccion = datosAficionadoActualizar.direccion
        this.aficionado.poblacion = datosAficionadoActualizar.poblacion
        this.aficionado.codigo_postal = datosAficionadoActualizar.codigo_postal

        this.aficionadoSubject.next(this.aficionado);
        localStorage.setItem('aficionado', JSON.stringify(this.aficionado));
      },
      error: (error) => {
        if(error.status == 400){
          this.mostrarErrorAficionado = true
        }
      }
    })
  }

  /*
  * Metodo para cerrar las alertas que aparecen en la ejecucion.
  */
  cerrarAlerta() {
    this.mostrarErrorRegistro = false
    this.mostrarUsuarioActualizado = false
    this.mostrarAficionadoActualizado = false
    this.mostrarErrorAficionado = false
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

}
