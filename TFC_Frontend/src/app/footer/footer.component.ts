import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

    mostrarFooter : boolean = true
  
    constructor(private router : Router) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event) => {
        if(this.router.url === '/inicioSesison' || this.router.url === '/registro'){
          this.mostrarFooter = false
        }else{
          this.mostrarFooter = true
        }
      })
    }
  

}
