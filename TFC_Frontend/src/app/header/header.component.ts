import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CardIdiomaComponent } from '../card-idioma/card-idioma.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  mostrarBarraNav : boolean = true

  constructor (private router : Router, public dialog: MatDialog){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if(this.router.url === '/'){
        this.mostrarBarraNav = true
      }else{
        this.mostrarBarraNav = false
      }
    })
  }

  cambiarIdioma(){
    const dialogo1 = this.dialog.open(CardIdiomaComponent);
  }
}