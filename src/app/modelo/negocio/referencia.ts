import { ItemsReferencia } from "./itemsReferencia";
import { TipoReferencia } from "./tipoReferencia";

export class Referencia{
    itemsReferencia: ItemsReferencia[];
    fechaAlta:string;
    _id:string;
    tipoReferencia : TipoReferencia;
    comentario:string;
    __v:number;
}