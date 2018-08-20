import { Domicilio } from "./domicilio";
import { ItemsReferencia } from'./itemsReferencia';
export class Comercio{
    estado: boolean;
    referencias: string[];
    _id: string;
    cuit: string;
    razonSocial: string;
    domicilio: Domicilio;
    fechaAlta: string;
    __v: number;
}