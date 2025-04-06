import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { RegistroComponent } from './registro/registro.component';
import { TiendaComponent } from './tienda/tienda.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProductoComponent } from './producto/producto.component';
import { CarritoComponent } from './carrito/carrito.component';
import { PasarelaPagoComponent } from './pasarela-pago/pasarela-pago.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AreaPedidosComponent } from './area-pedidos/area-pedidos.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path : 'inicioSesion',
    component : InicioSesionComponent
  },
  {
    path : 'registro',
    component : RegistroComponent
  },
  {
    path: 'tienda',
    component: TiendaComponent
  },
  {
    path: 'producto/:id',
    component: ProductoComponent
  },
  {
    path: 'carrito',
    component: CarritoComponent
  },
  {
    path: 'pasarelapago',
    component: PasarelaPagoComponent
  },
  {
    path: 'perfilUsuario',
    component: PerfilUsuarioComponent
  },
  {
    path: 'areaPedidos',
    component: AreaPedidosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
