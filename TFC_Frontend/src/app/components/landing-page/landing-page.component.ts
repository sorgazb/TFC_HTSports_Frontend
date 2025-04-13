import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class LandingPageComponent implements AfterViewInit {

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

  mostrarLandingPage : boolean = true

  mostrarInfoAficionado : boolean = false
  mostrarInfoJugador : boolean = false
  mostrarInfoCT : boolean = false

  translate !: TranslateService;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(translate: TranslateService, private router : Router) {
    this.translate = translate
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

  ngAfterViewInit(): void {
    const video = this.videoPlayer.nativeElement
    if (video) {
      video.muted = true
      video.autoplay = true
      video.loop = true
      video.play().catch(error => {})
    }
  }

  /*
  * Metodo para mostrar las funcionalidades de las que podran disfrutar los aficionados.
  */ 
  funcMostrarInfoAficionado(){
    if(!this.mostrarInfoAficionado){
      this.mostrarInfoAficionado = true
    }else{
      this.mostrarInfoAficionado = false
    }
  }

  /*
  * Metodo para mostrar las funcionalidades de las que podran disfrutar los jugadores.
  */ 
  funcMostrarInfoJugador(){
    if(!this.mostrarInfoJugador){
      this.mostrarInfoJugador = true
    }else{
      this.mostrarInfoJugador = false
    }
  }

  /*
  * Metodo para mostrar las funcionalidades de las que podran disfrutar los miembros
  * del cuerpo tecnico.
  */ 
  funMostrarInfoCT(){
    if(!this.mostrarInfoCT){
      this.mostrarInfoCT = true
    }else{
      this.mostrarInfoCT = false
    }
  }

}
