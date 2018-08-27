import { Contacto } from "./contacto";
import { Titular } from "./titular";
import { TipoCliente } from "./tipo-cliente";
import { ItemsReferencia } from "./itemsReferencia";
import { Referencia } from "./referencia";
import { Comercio } from "./comercio";

export class Cliente {
    estado: boolean;
    referencias: Referencia[];
    contactos: Contacto;
    comercios: Comercio[];
    _id:string;
    titular:Titular;
    tipoCliente:TipoCliente;
    fechaAlta: string;
    __v: number;

    dni:string = this.getDni();
getDni():string{
    return this.titular.dni;
}

}
