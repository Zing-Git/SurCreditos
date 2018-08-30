import { Documentos } from "./documentos";
import { Cliente } from "./cliente";
import { Garante } from "./garante";
import { Comercio } from "./comercio";
import { PlanPago } from "./planPago";
import { Estado } from "./estado";

export class Credito {
    documento: Documentos[];
    _id: string;
    cliente: Cliente[];
    garante: Garante;
    comercio: Comercio;

    montoPedido: string;
    porcentajeInteres: string;
    montoInteres: number;
    tieneCobranzaADomicilio: boolean;
    porcentajeCobranzaADomicilio: string;
    montoCobranzaADomicilio: string;
    cantidadCuotas: string;
    valorCuota: string;

    planPagos: PlanPago;
    legajo_prefijo: string;
    fechaAlta: string;
    legajo: string;
    usuario: string;
    estado: Estado;
    __v: number;
}
