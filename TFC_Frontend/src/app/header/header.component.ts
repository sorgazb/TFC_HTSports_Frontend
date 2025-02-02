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
    {value : 'es', display : 'Español'},
    {value : 'en', display : 'English'}
  ]

  predefinedCountries = [
    {
      name: 'Germany',
      alpha2Code: 'DE',
      alpha3Code: 'DEU',
      numericCode: '276'
    },
    {
      name: 'Greece',
      alpha2Code: 'GR',
      alpha3Code: 'GRC',
      numericCode: '300'
    },
    {
      name: 'France',
      alpha2Code: 'FR',
      alpha3Code: 'FRA',
      numericCode: '250'
    },
    {
      name: 'Belgium',
      alpha2Code: 'BE',
      alpha3Code: 'BEL',
      numericCode: '056'
    },
  ];

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
