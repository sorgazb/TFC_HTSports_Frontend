import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
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
export class LandingPageComponent {

  imgCarruselEsp = [
    '../../assets/img/carrusel/tienda_ES.png',
    '../../assets/img/carrusel/tienda_ES.png',
    '../../assets/img/carrusel/tienda_ES.png',
    '../../assets/img/carrusel/tienda_ES.png',
    '../../assets/img/carrusel/tienda_ES.png'
  ];
  
  imgCarruselEng = 
  [
    '../../assets/img/carrusel/tienda_EN.png',
    '../../assets/img/carrusel/tienda_EN.png',
    '../../assets/img/carrusel/tienda_EN.png',
    '../../assets/img/carrusel/tienda_EN.png',
    '../../assets/img/carrusel/tienda_EN.png'
  ];
  effect = 'scrollx';

  mostrarBarraNav : boolean = false

  mostrarInfoAficionado : boolean = false
  mostrarInfoJugador : boolean = false
  mostrarInfoCT : boolean = false

  translate !: TranslateService;

  mostrarLandingPage : boolean = true

  constructor(translate: TranslateService, private router : Router) {
    this.translate = translate;
    console.log(this.translate.currentLang == 'es')
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if(this.router.url === '/'){
        this.mostrarLandingPage = true
      }else{
        this.mostrarLandingPage = false
      }
    })
  }


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
