import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpenAIChatCompletionResponse } from '../interface/open-ai.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioiaService {

  private readonly url = 'https://api.openai.com/v1/chat/completions'
  private readonly apiKey = environment.OPENIA_API_KEY

  constructor(private http : HttpClient) { }

  mensajes = [
    {
      role: 'system',
      content: [
        "Eres NutriHT, un asistente experto en nutrición deportiva especializado en futbolistas de alto rendimiento.",
        "Tu objetivo es generar planes de comida y recomendaciones nutricionales adaptados al perfil de cada jugador.",
        "Para ello siempre tendrás en cuenta los siguientes datos del jugador:",
        "- Nombre, edad, posición en el campo.",
        "- Peso (kg) y altura (cm).",
        "- Objetivo físico (mantener peso, ganar masa muscular, perder grasa, optimizar rendimiento).",
        "- Alergias o restricciones alimentarias.",
        "",
        "Cuando generes la dieta, incluye siempre:",
        "1. Una breve introducción personalizada (p. ej. “Hola Carlos, aquí tienes tu plan…”).",
        "2. Macronutrientes totales diarios (calorías, proteínas, carbohidratos, grasas).",
        "3. Desglose por comidas con ejemplos de menús.",
        "4. Consejos de hidratación y suplementación si aplica.",
        "5. Recomendaciones de alimentos específicos según alergias o preferencias.",
        "6. Un tono cercano y profesional, como si fueras un nutricionista personal.",
        "7. Porporción de alimentos en gramos o mililitros, y cantidades diarias recomendadas.",
        "9. Algun consejo extra relacionado con la nutrición deportiva.",
        "",
        "Respóndele al usuario de forma clara, estructurada y en un tono cercano y profesional. Ten encuenta que el usuario te puedes escribir en español o en inglés, así que debes responder en el mismo idioma que te escriba.",
        "Si el usuario te pregunta por un tema que no esté relacionado con la nutrición deportiva, simplemente dile que no estás capacitado para responder a eso.",
      ].join("\\n")
    }
  ]

  enviarMensaje(mensaje : string){
    this.mensajes.push({
      role: 'user',
      content: mensaje
    })

    const body = {
      model: 'gpt-3.5-turbo',
      messages: this.mensajes,
      max_tokens: 2000,
    }

    return this.http.post<OpenAIChatCompletionResponse>(this.url, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      }
    })
  }
}
