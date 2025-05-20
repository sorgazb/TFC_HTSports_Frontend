import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CuerpoTecnico } from 'src/app/class/cuerpo-tecnico';
import { DetalleSesion } from 'src/app/class/detalle-sesion';
import { Jugador } from 'src/app/class/jugador';
import { Partido } from 'src/app/class/partido';
import { SesionEntrenamiento } from 'src/app/class/sesion-entrenamiento';
import { Usuario } from 'src/app/class/usuario';
import { ServicioPartidoService } from 'src/app/services/servicio-partido.service';
import { ServicioSesionEntrenamientoService } from 'src/app/services/servicio-sesion-entrenamiento.service';

@Component({
  selector: 'app-calendario-equipo',
  templateUrl: './calendario-equipo.component.html',
  styleUrls: ['./calendario-equipo.component.css']
})
export class CalendarioEquipoComponent implements OnInit {

  usuario!: Usuario
  cuerpoTecnico!: CuerpoTecnico
  jugador!: Jugador

  partidosEquipo!: Partido[]

  sesionesEntrenamientoEquipo: SesionEntrenamiento[] = []
  detallesSesionesEntrenamientoEquipo: any[] = []

  eventMap: { [fecha: string]: { tipo: 'partido' | 'entrenamiento', descripcion: string, hora?: string }[] } = {}

  eventosSeleccionados: { tipo: string, descripcion: string }[] = [];
  mensajeEventosSeleccionados: string = ''

  translate !: TranslateService

  constructor(private cd: ChangeDetectorRef, translate: TranslateService, private serviciosPartido: ServicioPartidoService, private router: Router, private servicioSesionEntrenamiento: ServicioSesionEntrenamientoService) {
    this.translate = translate
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('usuario')) {
      this.router.navigate(['/error'])
    }

    if (!localStorage.getItem('cuerpoTecnico') && !localStorage.getItem('jugador')) {
      this.router.navigate(['/error'])
    }

    const usuarioAux = sessionStorage.getItem('usuario')
    const usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario

    const cuerpoTecnicoAux = localStorage.getItem('cuerpoTecnico')
    if (cuerpoTecnicoAux) {
      this.cuerpoTecnico = JSON.parse(cuerpoTecnicoAux!)
    }

    const jugadorAux = localStorage.getItem('jugador')
    if (jugadorAux) {
      this.jugador = JSON.parse(jugadorAux!)
    }

    let idEquipo = 0

    if (this.cuerpoTecnico) {
      idEquipo = this.cuerpoTecnico.equipo_id
    }

    if (this.jugador) {
      idEquipo = this.jugador.equipo_id
    }
    
    this.serviciosPartido.obtenerPartidosEquipo(idEquipo).subscribe((partidos: any[]) => {
      this.partidosEquipo = partidos.map(item => {
        const partido = item.partido as Partido;
        partido.fecha = new Date(partido.fecha);
        return partido;
      });

      this.eventMap = {}

      partidos.forEach(item => {
        const partido = item.partido as Partido
        const equipos = item.equipos
        const key = this.obtenerFechaClave(new Date(partido.fecha));
        const nombresEquipos = equipos.map((e: any) => e.nombre).join(' vs ')

        if (!this.eventMap[key]) {
          this.eventMap[key] = []
        }
        if(this.translate.currentLang == 'es'){
          this.eventMap[key].push({
            tipo: 'partido',
            descripcion: `Partido: ${nombresEquipos} - ${partido.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h`
          })
        }else{
          this.eventMap[key].push({
            tipo: 'partido',
            descripcion: `Match: ${nombresEquipos} - ${partido.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h`
        })
        }
      })
    })
    
    this.servicioSesionEntrenamiento.obtenerSesionesEntrenamientoEquipo(idEquipo).subscribe((sesionesEntrenamiento: SesionEntrenamiento[]) => {
      this.sesionesEntrenamientoEquipo = sesionesEntrenamiento
      for (const sesionEntrenamiento of this.sesionesEntrenamientoEquipo) {
        this.cargarEntrenamientosSesion(sesionEntrenamiento.ID)
      }
    })
  }
  
  cargarEntrenamientosSesion(sesionId: number) {
    const sesion = this.sesionesEntrenamientoEquipo.find(s => s.ID === sesionId)
    if (sesion?.DetallesSesion?.length) return
    
    this.servicioSesionEntrenamiento.obtenerEntrenamientosSesion(sesionId).subscribe({
      next: (sesionCompleta) => {
        const sesionIndex = this.sesionesEntrenamientoEquipo.findIndex(s => s.ID === sesionId)
        if (sesionIndex !== -1) {
          const detalles = sesionCompleta.DetallesSesion
          this.sesionesEntrenamientoEquipo[sesionIndex].DetallesSesion = detalles;
          this.sesionesEntrenamientoEquipo = [...this.sesionesEntrenamientoEquipo]
          this.cd.detectChanges()
          
          for (const detalle of detalles) {
            const key = this.obtenerFechaClave(new Date(detalle.fecha));
            
            if (!this.eventMap[key]) {
              this.eventMap[key] = []
            }
            if(this.translate.currentLang == 'es'){
              this.eventMap[key].push({
                tipo: 'entrenamiento',
                descripcion: `${detalle.entrenamiento?.tipo.toLocaleUpperCase()}`
              })
            }else{
              this.eventMap[key].push({
                tipo: 'entrenamiento',
                descripcion: `${detalle.entrenamiento?.tipo.toLocaleUpperCase()}`
              })
            }
          }
        }
      }
    })
  }

selectChange(select: Date): void {
  const key = this.obtenerFechaClave(select);
  this.eventosSeleccionados = this.eventMap[key] || [];

  if (this.eventosSeleccionados.length > 0) {
    const descripciones = this.eventosSeleccionados.map(e =>
      this.translate.currentLang == 'es'
        ? (e.tipo === 'partido' ? `🟢 ${e.descripcion}` : `🔵 Entrenamiento: ${e.descripcion}`)
        : (e.tipo === 'partido' ? `🟢 ${e.descripcion}` : `🔵 Training: ${e.descripcion}`)
    );
    if(this.translate.currentLang == 'es'){
      this.mensajeEventosSeleccionados = `Eventos del ${select.toLocaleDateString()}: ` + descripciones.join(' | ')
    }else{
      this.mensajeEventosSeleccionados = `Events of ${select.toLocaleDateString()}: ` + descripciones.join(' | ')
    } 
  }
}

public obtenerFechaClave(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

}
