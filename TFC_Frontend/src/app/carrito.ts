import { Producto } from "./producto";

export class Carrito {
    ID !: number;
    producto !: Producto;
    cantidad !: number;
    talla !: string;
}
