import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Entrada } from 'src/app/class/entrada';
import { Partido } from 'src/app/class/partido';
import { ServicioEntradaService } from 'src/app/services/servicio-entrada.service';
import { ServicioEquipoService } from 'src/app/services/servicio-equipo.service';
import { ServicioPartidoService } from 'src/app/services/servicio-partido.service';
declare var require: any;
const imageMapResize = require('image-map-resizer')
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from 'ngx-bootstrap-icons';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

declare var paypal: any;

@Component({
  selector: 'app-compra-entradas',
  templateUrl: './compra-entradas.component.html',
  styleUrls: ['./compra-entradas.component.css']
})
export class CompraEntradasComponent implements OnInit {

  translate!: TranslateService

  @ViewChild('paypal', { static: false }) paypalElement!: ElementRef

  partido : Partido = {
    ID: 0,
    fecha: new Date(),
    estado: "",
    clima: "",
    resultado: "",
    asistencia: 0,
    equipos: []
  }

  Entrada = {
    ID: 0,
    id_Aficionado: 0,
    id_Partido: 0,
    zona: "",
    precio: 0,
    estado: ""
  }

  alerta = {
    mostrar: false,
    mensaje: '',
  }

  existeEntrada = false

  constructor(translate : TranslateService, private router : Router, private serviciosPartido : ServicioPartidoService, private serviciosEquipo : ServicioEquipoService, private servicioEntrada : ServicioEntradaService) {
    this.translate = translate
  }

  ngOnInit(): void {

    if(!sessionStorage.getItem('usuario')){
      this.router.navigate(['/error'])
    }

    if(!localStorage.getItem('aficionado')){
      this.router.navigate(['/error'])
    }

    let idPartido = Number(this.router.url.split('/').pop())
    this.serviciosPartido.obtenerPartido(idPartido).subscribe((partido: any) => {
      let infoPartido = partido.partido
      let equiposPartido = partido.equipos
      this.partido.ID = infoPartido.ID
      this.partido.fecha = new Date(infoPartido.fecha)
      this.partido.estado = infoPartido.estado
      this.partido.clima = infoPartido.clima
      this.partido.resultado = infoPartido.resultado
      this.partido.asistencia = infoPartido.asistencia
      this.partido.equipos = equiposPartido
    });
  }

  ngAfterViewInit(): void {
    imageMapResize()
  }

  /*
  * Metodo que crear una entrada nueva de tipo discapacidad.
  */
  crearEntradaDiscapacidad(){
    this.existeEntrada = true
    this.Entrada.id_Aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}').ID
    this.Entrada.id_Partido = this.partido.ID
    this.Entrada.zona = "discapacidad"
    this.Entrada.precio = 30
    this.Entrada.estado = "cancelada"
    this.servicioEntrada.crearEntrada(this.Entrada).subscribe((entrada: Entrada) => {
      this.Entrada = entrada
    })
    setTimeout(() => {
      this.pasarelaPaypal()
    }, 0)
  }

  /*
  * Metodo que crea una entrada nueva de tipo tribuna.
  */
  crearEntradaTribuna(){
    this.existeEntrada = true
    this.Entrada.id_Aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}').ID
    this.Entrada.id_Partido = this.partido.ID
    this.Entrada.zona = "tribuna"
    this.Entrada.precio = 50
    this.Entrada.estado = "cancelada"
    this.servicioEntrada.crearEntrada(this.Entrada).subscribe((entrada: Entrada) => {
      this.Entrada = entrada
    })
    setTimeout(() => {
      this.pasarelaPaypal()
    }, 0)
  }

  /*
  * Metodo que crea una entrada nueva de tipo general.
  */ 
  crearEntradaGeneral(){
    this.existeEntrada = true
    this.Entrada.id_Aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}').ID
    this.Entrada.id_Partido = this.partido.ID
    this.Entrada.zona = "general"
    this.Entrada.precio = 40
    this.Entrada.estado = "cancelada"
    this.servicioEntrada.crearEntrada(this.Entrada).subscribe((entrada: Entrada) => {
      this.Entrada = entrada
    })
    setTimeout(() => {
      this.pasarelaPaypal()
    }, 0)
  }

  /*
  * Metodo que crea una entrada nueva de tipo vip.
  */
  crearEntradaVip(){
    this.existeEntrada = true
    this.Entrada.id_Aficionado = JSON.parse(localStorage.getItem('aficionado') || '{}').ID
    this.Entrada.id_Partido = this.partido.ID
    this.Entrada.zona = "vip"
    this.Entrada.precio = 100
    this.Entrada.estado = "cancelada"
    this.servicioEntrada.crearEntrada(this.Entrada).subscribe((entrada: Entrada) => {
      this.Entrada = entrada
    })
    setTimeout(() => {
      this.pasarelaPaypal();
    }, 0)
  }

  /*
  * Metodo que hace la llamada a la API Paypal Developers,
  * la cual permite realizar pagos reales en la web.
  */ 
  pasarelaPaypal() {
    if (this.paypalElement && this.paypalElement.nativeElement) {
      this.paypalElement.nativeElement.innerHTML = ''
    }
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: 'Compra en Mi Tienda',
            amount: {
              currency_code: 'EUR',
              value: this.Entrada.precio.toFixed(2)
            }
          }]
        })
      },
      onApprove: async (data: any, actions: any) => {
        const order = await actions.order.capture()
        this.servicioEntrada.pagarEntrada(this.Entrada.ID).subscribe(() => {
          this.servicioEntrada.obtenerEntrada(this.Entrada.ID).subscribe((entrada: Entrada) => {
            this.generarPDF(entrada)
          })
          if(this.translate.currentLang == 'es'){
            this.mostrarAlerta('Pago aprobado. ¡Gracias por tu compra!')
          }
          if(this.translate.currentLang == 'gb'){
            this.mostrarAlerta('Payment approved. Thank you for your purchase!')
          }
        })
      },
      onError: (err: any) => {
        this.servicioEntrada.cancelarEntrada(this.Entrada.ID).subscribe(() => {
        })
        if(this.translate.currentLang == 'es'){
          this.mostrarAlerta('Ocurrió un error al procesar el pago')
        }
        if(this.translate.currentLang == 'gb'){
          this.mostrarAlerta('An error occurred while processing the payment. Please try again.')
        }
      }
    }).render(this.paypalElement.nativeElement)
  }

  /*
  * Metodo para mostrar una alerta con el resultado del pago. Una vez transcurridos 5 segundos
  * redirige al usario a la pagina principal.
  * @param {string} => Contenido del mensaje de la alerta.
  */
  mostrarAlerta(mensaje: string) {
    this.alerta.mensaje = mensaje
    this.alerta.mostrar = true
    
    setTimeout(() => {
      this.router.navigate(['/'])
    }, 5000)
  }
  
  /*
  * Metodo que genera un PDF con la entrada comprada por el usuario para el partido seleccionado.
  * @param {entrada : any} => Entrada comprada por el usuario.
  */
  generarPDF(entrada: any): void {
    Promise.all([
      this.generarImgBase64(this.partido.equipos[0].escudo),
      this.generarImgBase64(this.partido.equipos[1].escudo),
      this.generarImgBase64('../../../assets/img/logo.png')
    ]).then(([escudoLocal, escudoVisitante, logo]) => {
      const docDefinition: any = {
        content: [
          { image: logo, width: 200, alignment: 'center' },
          { text: 'Entrada Partido', style: 'header' },
          {
            columns: [
              {
                image: escudoLocal,
                width: 100,
                alignment: 'center',
              },
              {
                text: 'VS',
                style: 'versus',
                alignment: 'center',
                margin: [0, 40, 0, 0]
              },
              {
                image: escudoVisitante,
                width: 100,
                alignment: 'center'
              }
            ],
            margin: [0, 20]
          },
          {
            columns: [
              { text: `Equipo Local: ${this.partido.equipos[0].nombre}`, style: 'equipo', alignment: 'center' },
              { text: `Equipo Visitante: ${this.partido.equipos[1].nombre}`, style: 'equipo', alignment: 'center' }
            ],
            columnGap: 20,
            margin: [0, 10]
          },
          { text: `Fecha del partido: ${this.partido.fecha.toLocaleDateString()}`, style: 'fecha' },
          { text: `ID Entrada: ${entrada.ID}`, style: 'info' },
          { text: `Zona: ${entrada.zona}`, style: 'info' },
          { text: `Precio: ${entrada.precio}€`, style: 'info' },
          { text: `Estado: ${entrada.estado}`, style: 'info' },
          { text: `Estadio: ${this.partido.equipos[0].estadio}`, style: 'info' },
        ],
        styles: {
          header: {
            fontSize: 26,
            bold: true,
            color: '#274a80',
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
          info: {
            fontSize: 14,
            margin: [0, 2],
            color: '#000'
          },
          equipo: {
            fontSize: 14,
            bold: true,
            color: '#274a80'
          },
          fecha: {
            fontSize: 14,
            italics: true,
            color: '#555',
            alignment: 'center',
            margin: [0, 20, 0, 0]
          },
          versus: {
            fontSize: 28,
            bold: true,
            color: '#274a80'
          }
        }
      }
      pdfMake.createPdf(docDefinition).download(`entrada-${entrada.ID}.pdf`)
    }).catch(error => {})
  }
  
  /*
  * Metodo que genera una imagen en base64 a partir de una URL.
  * @param {url : string} => URL de la imagen a convertir.
  * @return {Promise<string>} => Promesa que devuelve la imagen en base64.
  */
  generarImgBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = url
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png')
        resolve(dataURL)
      };
      img.onerror = (error) => {
        console.error('Error cargando imagen:', url, error)
        reject(error)
      }
    })
  }

  /*
  * Metodo que redirige al usuario hasta la plantilla
  * del equipo seleccionado
  */
  consultarEquipo(idEquipo : number){
    this.router.navigate(['miEquipo/'+idEquipo])
  }
}

