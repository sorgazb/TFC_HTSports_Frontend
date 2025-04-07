import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuario';
import { ServicioUsuarioService } from '../services/servicio-usuario.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  usuario !: Usuario

  ngOnInit(): void {
    let usuarioAux = sessionStorage.getItem('usuario')
    let usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario
    console.log("Usuario en sesion: ", this.usuario)
  }

  constructor(private seriviosUsuario : ServicioUsuarioService) { }

  obtenerImgPerfil(): string {
    if (this.usuario.avatar) {
      return this.usuario.avatar;
    }else{
      return 'https://www.w3schools.com/howto/img_avatar.png';
    }
  }

}
