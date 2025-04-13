import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Country} from '@angular-material-extensions/select-country';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-card-idioma',
  templateUrl: './card-idioma.component.html',
  styleUrls: ['./card-idioma.component.css']
})
export class CardIdiomaComponent {
  
  idiomas: Country[] = [
    {
      name: 'Español',
      alpha2Code: 'es',
      alpha3Code: 'ESP',
      numericCode: '276',
      callingCode: '+49'
    },
    {
      name: 'English',
      alpha2Code: 'gb',
      alpha3Code: 'GBR',
      numericCode: '300',
      callingCode: '+30'
    }
  ];
  
  idiomaPorDefecto: Country = {
    name: 'Español',
    alpha2Code: 'es',
    alpha3Code: 'ESP',
    numericCode: '276',
    callingCode: '+49'
  };

  constructor(public dialogRef: MatDialogRef<CardIdiomaComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private translate: TranslateService){}

  /*
  * Metodo que cambia el idioma de la web.
  * @param {Country} => idioma
  */ 
  cambiarIdioma(country: Country) {
    const idioma = country.alpha2Code
    this.translate.use(idioma)
  }

  /*
  * Metodo para cerrar el cuadro de dialogo.
  */
  confirmar() {
    this.dialogRef.close();
  }

}
