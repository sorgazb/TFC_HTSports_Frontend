import { Component, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HT Sports';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
    const lang = this.translate.getBrowserLang();
    if(lang !== 'en' && lang !== 'es'){
      this.translate.setDefaultLang('en');
    }else{
      this.translate.use(lang)
    }
  }
}
