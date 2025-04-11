import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { RegistroComponent } from './components/registro/registro.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PasarelaPagoComponent } from './components/pasarela-pago/pasarela-pago.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { AreaPedidosComponent } from './components/area-pedidos/area-pedidos.component';

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
