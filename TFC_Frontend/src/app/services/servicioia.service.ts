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
        "Eres HTDietCoachAI, un asistente experto en nutrición deportiva especializado en futbolistas de alto rendimiento.",
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
        "",
        "Respóndele al usuario de forma clara, estructurada y en un tono cercano y profesional."
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
