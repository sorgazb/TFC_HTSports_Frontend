import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../usuario';
import { Observable } from 'rxjs';
import { Aficionado } from '../aficionado';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuarioService {

  private apiUrl = 'https://tfc-htsports-api-884687165526.europe-southwest1.run.app/api/usuarios'; // Base URL de la API

  constructor(private http: HttpClient) { }

  // Método para registrar un usuario
  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    console.log('Registrando usuario:', usuario); // Log de los datos antes de enviarlos
    return this.http.post<Usuario>(`${this.apiUrl}/registrar`, usuario);
  }
  
  // Método para loguear un usuario
  loguearUsuario(loginData: { correo_electronico: string, password: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, loginData);
  }
  
  // Método para obtener aficionado por ID
  obtenerAficionado(id: number): Observable<Aficionado> {
    if (!id) {
      console.error("El ID del aficionado es inválido");
      return new Observable();  // Retorna un Observable vacío si el ID no es válido
    }
    return this.http.get<Aficionado>(`${this.apiUrl}/aficionado/${id}`);
  }

  // Método para obtener usuario por correo electrónico
  obtenerUsuario(correo_electronico: string): Observable<Usuario> {
    if (!correo_electronico) {
      console.error("El correo electrónico es inválido");
      return new Observable();  // Retorna un Observable vacío si el correo es inválido
    }
    return this.http.get<Usuario>(`${this.apiUrl}/usuario/${correo_electronico}`);
  }

  comprobarImagenPerfil(img: File): boolean {
    const url = 'https://rapidapi.com/victorvaldescobos-KplEys0xN/api/faceinphoto/playground/apiendpoint_48cc7300-22b7-42e8-a494-3c1e3e503371';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': 'f4c3f2d7d5mshb4e9a6e1a0f8e2ep1d3c6fjsn9e6c7d3c8b8e',
      'X-RapidAPI-Host': 'faceinphoto.p.rapidapi.com'
    });
    const body = {
      "url": img
    };
    let result = false; // Default return value
    this.http.post(url, body, { headers }).subscribe(
      (response) => {
        console.log('Respuesta de la API:', response);
        result = true;
      },
      (error) => {
        console.error('Error al comprobar la imagen:', error);
        result = false; 
      }
    );
    return result; // Return the result
  }
}
