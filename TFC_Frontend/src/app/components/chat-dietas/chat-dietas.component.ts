import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { interval, pipe, takeWhile } from 'rxjs';
import { Jugador } from 'src/app/class/jugador';
import { Usuario } from 'src/app/class/usuario';
import { ServicioiaService } from 'src/app/services/servicioia.service';

type TipoChat = 'IA' | 'Usuario';

type Chats = {
  tipo: TipoChat,
  mensaje: string
}

@Component({
  selector: 'app-chat-dietas',
  templateUrl: './chat-dietas.component.html',
  styleUrls: ['./chat-dietas.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ChatDietasComponent implements OnInit{
  
  usuario!: Usuario
  jugador!: Jugador
  chats: Chats[] = []
  mensaje: string = ''
  
  alergias = [
    '🍞 Gluten',
    '🌽 Maiz',
    '🥜 Frutos secos',
    '🦀 Marisco',
    '🥚 Huevo',
    '🫛 Soja',
    '🐟 Pescado',
    '🥛 Lactosa',
    '🍅 Tomate',
    '🍫 Chocolate',
  ]
  
  allergiesEng = [
    '🍞 Gluten',
    '🌽 Corn',
    '🥜 Nuts',
    '🦀 Shellfish',
    '🥚 Egg',
    '🫛 Soy',
    '🐟 Fish',
    '🥛 Lactose',
    '🍅 Tomato',
    '🍫 Chocolate',
  ]

  peso !: number
  altura !: number

  alergiasSeleccionadas: string[] = [];

  abiertoAlergias = false
  abiertoPeso = false
  abiertoAltura = false

  cargando: boolean = false

  translate !: TranslateService

  @ViewChild('contentChat', { static: true }) contentChat!: ElementRef<HTMLElement>;

  constructor(private router : Router, private servicioIA : ServicioiaService, private cd : ChangeDetectorRef,translate: TranslateService) {
    this.translate = translate
  }
  
  ngOnInit(): void {
    if (!sessionStorage.getItem('usuario')) {
      this.router.navigate(['/error'])
    }

    if (!localStorage.getItem('cuerpoTecnico') && !localStorage.getItem('jugador')) {
      this.router.navigate(['/error'])
    }

    const usuarioAux = sessionStorage.getItem('usuario')
    const usuarioSesion = JSON.parse(usuarioAux!)
    this.usuario = usuarioSesion.usuario

    const jugadorAux = localStorage.getItem('jugador')
    if (jugadorAux) {
      this.jugador = JSON.parse(jugadorAux!)
    }
  }

  agregarChat(tipo: TipoChat, mensaje: string) {
    this.chats.push({tipo, mensaje})
  }

  mandarMensaje(mensaje: string) {
    if(mensaje.length > 0){
      mensaje = this.usuario.nombre + ':\n' + mensaje
      if (this.peso != undefined && this.peso != 0 && this.translate.currentLang == 'es') {
        mensaje = mensaje + '\nPeso: ' + this.peso + ' kg'
      }
      if (this.altura != undefined && this.altura != 0 && this.translate.currentLang == 'es') {
        mensaje = mensaje + '\nAltura: ' + this.altura + ' cm'
      }
      if (this.alergiasSeleccionadas.length > 0 && this.translate.currentLang == 'es') {
        mensaje = mensaje+'\nAlergias: ' + this.alergiasSeleccionadas.join(', ')
      }
      if (this.peso != undefined && this.peso != 0 && this.translate.currentLang == 'gb') {
        mensaje = mensaje + '\nWeight: ' + this.peso + ' kg'
      }
      if (this.altura != undefined && this.altura != 0 && this.translate.currentLang == 'gb') {
        mensaje = mensaje + '\nHeight: ' + this.altura + ' cm'
      }
      if (this.alergiasSeleccionadas.length > 0 && this.translate.currentLang == 'gb') {
        mensaje = mensaje+'\nAllergies: ' + this.alergiasSeleccionadas.join(', ')
      }
      this.agregarChat('Usuario', mensaje)
      mensaje = mensaje + '\nEdad: ' + this.jugador.edad
      mensaje = mensaje + '\nPosicion: ' + this.jugador.posicion
      this.solicitarDieta(mensaje)
      this.mensaje = ''
      this.abiertoAlergias = false
      this.abiertoPeso = false
      this.abiertoAltura = false
      this.peso = 0
      this.altura = 0
      this.alergiasSeleccionadas = []
    }
  }

  abrirSelectAlergias() {
    this.abiertoAlergias = !this.abiertoAlergias
  }

  abrirInputPeso() {
    this.abiertoPeso = !this.abiertoPeso
  }

  abrirInputAltura() {
    this.abiertoAltura = !this.abiertoAltura
  }

  estaSeleccionada(alergia: string): boolean {
    return this.alergiasSeleccionadas.includes(alergia)
  }

  seleccionarAlergia(alergia: string) {
    if (this.estaSeleccionada(alergia)) {
      this.alergiasSeleccionadas = this.alergiasSeleccionadas.filter(a => a !== alergia)
    } else {
      this.alergiasSeleccionadas.push(alergia)
    }
  }

  convertToHtml(responseGpt: string){
    return responseGpt
      .replace(/\\n/g, '<br>')
      .replace(/(\d+(\.\d+)?)([Kk][Gg])/g, '<span class="peso">$1 kg</span>') 
      .replace(/(\d+(\.\d+)?)([Cc][Mm])/g, '<span class="altura">$1 cm</span>') // Resalta las alturas
      .replace(/(\d+(\.\d+)?)([Kk][Aa][Ll][Oo][Rr][Ii][Aa])/g, '<span class="calorias">$1 kcal</span>') // Resalta las calorías 
  }

  typeText(responseGpt: string){
    const responseHtml = this.convertToHtml(responseGpt)
    const responseLength = responseHtml.length
    let currentIndex = 0

    interval(10)
      .pipe(takeWhile(()=> currentIndex < responseLength))
      .subscribe(()=>{
        const currentHtml = responseHtml[currentIndex]
        if(currentIndex === 0) {
          this.agregarChat('IA', currentHtml)
        }else{
          const lastChat = this.chats[this.chats.length - 1]
          lastChat.mensaje += currentHtml
        }
        currentIndex++
        this.scrollToBottom()
        this.cd.detectChanges()
      })
  }

  scrollToBottom() {
    try{
      this.contentChat.nativeElement.scrollTop = this.contentChat.nativeElement.scrollHeight
    }catch (error) {
      console.error('')
    }
  }

  solicitarDieta(text : string){
    this.cargando = true
    this.servicioIA.enviarMensaje(text).subscribe(respuesta =>{
      const mensaje = respuesta.choices[0].message.content
      this.typeText(mensaje)
      this.servicioIA.mensajes.push({
        role: 'assistant',
        content: mensaje
      })
      this.cargando = false
    })
  }



}
