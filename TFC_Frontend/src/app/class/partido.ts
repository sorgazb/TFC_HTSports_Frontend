import { Equipo } from "./equipo";

export class Partido {
    ID !: number
    fecha !: Date
    estado !: string
    clima !: string
    resultado !: string
    asistencia !: number
    equipos !: Equipo[]
}
