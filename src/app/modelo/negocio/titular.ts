import { TipoDni } from "./tipoDni";
import { Domicilio } from "./domicilio";

export class Titular {
    _id: string;
    tipoDni: TipoDni; 
    dni: string;
    apellidos: string;
    nombres: string;
    domicilio:Domicilio;
    fechaNacimiento:string;
    fechaAlta:string;
    __v:number;    
}