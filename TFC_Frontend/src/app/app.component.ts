import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TFC_Frontend';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    const lang = this.translate.getBrowserLang();
    if(lang !== 'en' && lang !== 'es'){
      this.translate.setDefaultLang('en');
    }else{
      this.translate.use(lang)
    }
  }
  currentLang = localStorage.getItem('language') || 'es-ES';

  changeLanguage(lang: string) {
    console.log(lang);
    if (this.currentLang !== lang) {
      localStorage.setItem('language', lang);
      window.location.href = `/${lang}/`; // Recarga la app con el nuevo idioma.
    }
  }
}
