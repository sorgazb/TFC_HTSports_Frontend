import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CardIdiomaComponent } from '../card-idioma/card-idioma.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('collapseMenu', { static: false }) collapseMenu!: ElementRef;

  mostrarBarraNav : boolean = true

  toggleOpen !: HTMLElement;
  toggleClose !: HTMLElement;

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

  ngOnInit(): void {
    this.toggleOpen = document.getElementById('toggleOpen') as HTMLElement;
    this.toggleClose = document.getElementById('toggleClose') as HTMLElement;
  }
  
  handleClick() {
    if (!this.collapseMenu) return;
    const menu = this.collapseMenu.nativeElement;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
}