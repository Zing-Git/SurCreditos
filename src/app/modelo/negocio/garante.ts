import { Contacto } from "./contacto";
import { Titular } from "./titular";
import { TipoCliente } from "./tipo-cliente";

export class Garante{
    estado: boolean;
    referencias: string[];
    contactos: Contacto[];
    comercios: string[];
    _id: string;
    titular: Titular;
    tipoCliente: TipoCliente[];
    fechaAlta: string;
    __v: number;
}