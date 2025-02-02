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

  constructor(public dialogRef: MatDialogRef<CardIdiomaComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private translate: TranslateService){}
    selectedCountry: string = '';
  
  predefinedCountries: Country[] = [
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
  
  defaultValue: Country = {
    name: 'Español',
    alpha2Code: 'es',
    alpha3Code: 'ESP',
    numericCode: '276',
    callingCode: '+49'
  };

  onCountrySelected(country: Country) {
    const idioma = country.alpha2Code
    this.translate.use(idioma)
  }

  confirmar() {
    this.dialogRef.close();
  }

}
