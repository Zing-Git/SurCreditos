import { Domicilio } from "./domicilio";
import { ItemsReferencia } from'./itemsReferencia';
export class Comercio{
    estado: boolean;
    referencias: string[];
    _id: string;
    cuit: string;
    razonSocial: string;
    codigoActividad: string;   //agregado por pedro
    descripcionActividad:string;  //agregado por pedro
    domicilio: Domicilio; 
    fechaAlta: string;
    __v: number;
}