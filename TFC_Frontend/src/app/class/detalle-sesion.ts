import { Entrenamiento } from "./entrenamiento";

export class DetalleSesion {
    id !: number
    id_Sesion_Entrenamiento !: number
    id_Entrenamiento !: number
    fecha !: Date
    entrenamiento?: Entrenamiento; // Añadir relación
}
