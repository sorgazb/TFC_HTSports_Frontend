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
import { PartidosComponent } from './components/partidos/partidos.component';
import { DetallePartidoComponent } from './components/detalle-partido/detalle-partido.component';
import { CompraEntradasComponent } from './components/compra-entradas/compra-entradas.component';
import { AreaEntradasComponent } from './components/area-entradas/area-entradas.component';
import { PlantillaComponent } from './components/plantilla/plantilla.component';
import { AlienacionesComponent } from './components/alienaciones/alienaciones.component';
import { PerfilJugadorComponent } from './components/perfil-jugador/perfil-jugador.component';
import { PartidosEquipoComponent } from './components/partidos-equipo/partidos-equipo.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { PerfilCuerpoTecnicoComponent } from './components/perfil-cuerpo-tecnico/perfil-cuerpo-tecnico.component';
import { AreaJugadoresOjeadosComponent } from './components/area-jugadores-ojeados/area-jugadores-ojeados.component';
import { CalendarioEquipoComponent } from './components/calendario-equipo/calendario-equipo.component';

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
  },
  {
    path: 'partidos',
    component: PartidosComponent
  },
  {
    path: 'partidos/:id',
    component: DetallePartidoComponent
  },
  {
    path: 'entradas/:id',
    component: CompraEntradasComponent
  },
  {
    path: 'areaEntradas',
    component: AreaEntradasComponent
  },
  {
    path: 'miEquipo/:id',
    component: PlantillaComponent
  },
  {
    path: 'alineacion/:id',
    component: AlienacionesComponent
  },
  {
    path: 'jugador/:id',
    component: PerfilJugadorComponent
  },
  {
    path: 'partidos/equipo/:id',
    component: PartidosEquipoComponent
  },
  {
    path : 'error',
    component: AccesoDenegadoComponent
  },
  {
    path: 'cuerpoTecnico/:id',
    component: PerfilCuerpoTecnicoComponent
  },
  {
    path: 'areaojeador',
    component: AreaJugadoresOjeadosComponent
  },
  {
    path : 'calendario',
    component: CalendarioEquipoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
