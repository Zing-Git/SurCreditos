import { Cliente } from "./cliente";
import { Credito } from "./credito";

export class OrdenDb{
    creditoPagado:boolean;
    _id: string;
    cliente: Cliente;
    credito: Credito;
    montoAPagar: number;
    numeroOrden: number;
    fechaGeneracion: string;
    fechaPago: string;
    __v: number;
}