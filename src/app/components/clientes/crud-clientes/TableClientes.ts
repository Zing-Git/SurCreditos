import { TipoCliente } from "../../../modelo/negocio/tipo-cliente";
import { Titular } from "../../../modelo/negocio/titular";
import { Contacto } from "../../../modelo/negocio/contacto";

export interface TableClientes {
    estado: boolean;
    referencias: string[];
    contactos: Contacto;
    comercios: string[];
    _id: string;
    titular: Titular;
    tipoCliente: TipoCliente;
    fechaAlta: string;
    __v: number;

}