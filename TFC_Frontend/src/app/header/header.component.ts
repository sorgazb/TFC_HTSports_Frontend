import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  mostrarBarraNav : boolean = true

  idiomas = [
    {value : 'es', display : 'Español', icon:'🇪🇸'},
    {value : 'en', display : 'English'}
  ]

  constructor (private router : Router, private translate: TranslateService){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if(this.router.url === '/inicioSesion'){
        this.mostrarBarraNav = false
      }else if(this.router.url === '/registro'){
        this.mostrarBarraNav = false
      }else{
        this.mostrarBarraNav = true
      }
    })
  }

  onChange = (event : Event) => {
    const idioma = (event.target as HTMLSelectElement).value
    this.translate.use(idioma)
  }
}
