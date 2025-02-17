import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('200ms 200ms', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, height: 0 })),
      ]),
    ]),
  ],
})
export class InicioComponent{
  array = ['../../assets/img/carrusel/61alflToYuL._AC_SL1500_.jpg',
    '../../assets/img/carrusel/Gb-eArDWQAAAa13-2048x1365.webp'];
  effect = 'scrollx';

  mostrarBarraNav : boolean = false

  mostrarInfoAficionado : boolean = false
  mostrarInfoJugador : boolean = false
  mostrarInfoCT : boolean = false

  funcMostrarInfoAficionado(){
    if(!this.mostrarInfoAficionado){
      this.mostrarInfoAficionado = true
    }else{
      this.mostrarInfoAficionado = false
    }
  }

  funcMostrarInfoJugador(){
    if(!this.mostrarInfoJugador){
      this.mostrarInfoJugador = true
    }else{
      this.mostrarInfoJugador = false
    }
  }

  funMostrarInfoCT(){
    if(!this.mostrarInfoCT){
      this.mostrarInfoCT = true
    }else{
      this.mostrarInfoCT = false
    }
  }

}
