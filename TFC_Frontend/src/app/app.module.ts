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
import { InicioComponent } from './components/inicio/inicio.component';
import { HeaderComponent } from './components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { RegistroComponent } from './components/registro/registro.component';
import {NzAlertModule} from 'ng-zorro-antd/alert'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { CardIdiomaComponent } from './components/card-idioma/card-idioma.component';
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ObserveVisibilityDirective } from './directives/observe-visibility.directive';
import { FooterComponent } from './components/footer/footer.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { TiendaComponent } from './components/tienda/tienda.component';
import { MatPaginatorModule } from '@angular/material/paginator';  
import { MatTableDataSource } from '@angular/material/table';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PasarelaPagoComponent } from './components/pasarela-pago/pasarela-pago.component';
import { ToggleMenuDirective } from './directives/toggle-menu.directive';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { AreaPedidosComponent } from './components/area-pedidos/area-pedidos.component';
import { MatTableModule } from '@angular/material/table';

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
    FooterComponent,
    TiendaComponent,
    ProductoComponent,
    CarritoComponent,
    PasarelaPagoComponent,
    ToggleMenuDirective,
    PerfilUsuarioComponent,
    AreaPedidosComponent,
  ],
  imports: [
    BrowserModule,
    MatTableModule,
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
    NgxBootstrapIconsModule.pick(allIcons),
    MatPaginatorModule
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
