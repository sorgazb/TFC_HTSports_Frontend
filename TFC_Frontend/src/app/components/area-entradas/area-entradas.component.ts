import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entrada } from 'src/app/class/entrada';
import { Partido } from 'src/app/class/partido';
import { Pedido } from 'src/app/class/pedido';
import { ServicioEntradaService } from 'src/app/services/servicio-entrada.service';
import { ServicioPartidoService } from 'src/app/services/servicio-partido.service';
import { ServicioPedidoService } from 'src/app/services/servicio-pedido.service';

@Component({
  selector: 'app-area-entradas',
  templateUrl: './area-entradas.component.html',
  styleUrls: ['./area-entradas.component.css']
})
export class AreaEntradasComponent implements OnInit{

    entradas : Entrada[] = []
    partido !: Partido
  
    constructor(private serviciosEntrada: ServicioEntradaService, private servicioPartido: ServicioPartidoService, private router : Router) { }

    ngOnInit(): void {
      const aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}')
  
      this.serviciosEntrada.obtenerEntradasAficionado(aficionado.ID).subscribe((entradas: Entrada[]) => {
        this.entradas = entradas.sort((a, b) => b.ID - a.ID)
        this.entradas = entradas
  
        this.entradas.forEach(entrada => {
          if(entrada.estado === 'pagada' || entrada.estado === 'paid'){
            this.servicioPartido.obtenerPartido(entrada.id_Partido).subscribe((partido:any) => {
              this.partido = partido.partido
              if(this.partido.estado === 'enjuego' || this.partido.estado === 'finalizado' || this.partido.estado === 'Enjane' || this.partido.estado === 'finished'){
                this.serviciosEntrada.usarEntrada(entrada.ID).subscribe(() => {})
              }
            })
          }
        })
      })
    }

    /*
    * Metodo para consultar infotrmacion del partido correspondiente a la entrada seleccionada por el usuario.
    * @param {number} => id del partido.
    */
    consultarPartido(partido: number){
      this.servicioPartido.obtenerPartido(partido).subscribe((partido: any) => {
        this.partido = partido.partido
        if(this.partido.estado === 'enjuego' || this.partido.estado === 'finalizado' || this.partido.estado === 'Enjane' || this.partido.estado === 'finished') {
          this.router.navigate(['/partidos', this.partido.ID])
  
        }else{
          this.router.navigate(['/entradas', this.partido.ID])
        }
      })
    }
}
