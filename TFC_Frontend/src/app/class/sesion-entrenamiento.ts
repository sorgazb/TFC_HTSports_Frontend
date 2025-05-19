import { DetalleSesion } from "./detalle-sesion"

export class SesionEntrenamiento {
  ID!: number
  id_Equipo!: number
  id_Cuerpo_Tecnico!: number
  FechaInicio!: string
  FechaFin!: string
  DetallesSesion: DetalleSesion[] = []
}
