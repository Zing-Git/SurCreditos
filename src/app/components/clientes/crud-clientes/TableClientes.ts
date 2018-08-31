import { TipoCliente } from "../../../modelo/negocio/tipo-cliente";
import { Titular } from "../../../modelo/negocio/titular";
import { Contacto } from "../../../modelo/negocio/contacto";
import { Comercio } from "../../../modelo/negocio/comercio";

export interface TableClientes {
    estado: boolean;
    referencias: string[];
    contactos: Contacto;
    comercios: Comercio[];
    _id: string;
    titular: Titular;
    tipoCliente: TipoCliente;
    fechaAlta: string;
    __v: number;

}