import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { ServicioUsuarioService } from 'src/app/services/servicio-usuario.service';

@Component({
  selector: 'app-perfil-cuerpo-tecnico',
  templateUrl: './perfil-cuerpo-tecnico.component.html',
  styleUrls: ['./perfil-cuerpo-tecnico.component.css']
})
export class PerfilCuerpoTecnicoComponent {
    cuerpoTecnico !: CuerpoTecnico

    cargando : boolean = true
  
    constructor(private serviciosUsuario : ServicioUsuarioService, private router : Router){}
  
    ngOnInit(): void {
      
      if(!sessionStorage.getItem('usuario')){
        this.router.navigate(['/error'])
      }
      
      let id = Number(this.router.url.split('/').pop())
      this.serviciosUsuario.obtenerCuerpoTecnicoPlantilla(id).subscribe((cuerpoTecnico: CuerpoTecnico) => {
        this.cuerpoTecnico = cuerpoTecnico
        this.cargando = false
      })
    }
}
