import { Cliente } from "../../../modelo/negocio/cliente";
import { Credito } from "../../../modelo/negocio/credito";

export interface TableOrdenDePago{
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