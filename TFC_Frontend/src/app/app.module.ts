import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InicioComponent } from './inicio/inicio.component';
import { HeaderComponent } from './header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { RegistroComponent } from './registro/registro.component';
import {NzAlertModule} from 'ng-zorro-antd/alert'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { CardIdiomaComponent } from './card-idioma/card-idioma.component';
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ObserveVisibilityDirective } from './observe-visibility.directive';
import { FooterComponent } from './footer/footer.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    HeaderComponent,
    InicioSesionComponent,
    RegistroComponent,
    CardIdiomaComponent,
    LandingPageComponent,
    ObserveVisibilityDirective,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NzAlertModule,
    TranslateModule.forRoot({
      loader :{
        provide : TranslateLoader,
        useFactory : HttpLoaderFactory,
        deps : [HttpClient]
      }
    }),
    MatSelectCountryModule.forRoot('es'),
    MatDialogModule,
    MatButtonModule,
    NzCarouselModule,
    NgxBootstrapIconsModule.pick(allIcons)
  ],
  providers: [
    { provide: NZ_I18N, useValue: es_ES }
  ],
  bootstrap: [AppComponent],
  

})
export class AppModule { }

// Traducciones
export function HttpLoaderFactory(http : HttpClient){
  return new TranslateHttpLoader(http, './assets/languages/', '.json')
}
