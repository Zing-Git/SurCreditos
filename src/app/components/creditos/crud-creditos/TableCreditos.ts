import { Documentos } from '../../../modelo/negocio/documentos';
import { Cliente } from '../../../modelo/negocio/cliente';
import { Garante } from '../../../modelo/negocio/garante';
import { Comercio } from '../../../modelo/negocio/comercio';
import { PlanPago } from '../../../modelo/negocio/planPago';
import { Estado } from '../../../modelo/negocio/estado';

export interface TableCreditos {
    documentos: Documentos[];
    _id: string;
    cliente: Cliente;
    garante: Garante;
    comercio: Comercio;
    montoPedido: string;
    porcentajeInteres: string;
    montoInteres: string;
    tieneCobranzaADomicilio: boolean;
    porcentajeCobranzaADomicilio: string;
    montoCobranzaADomicilio: string;
    cantidadCuotas: number;
    valorCuota: string;
    planPagos: PlanPago;
    usuario: string;
    estado: Estado;
    legajo: string; // Agregó Jorge
    fechaAlta: string;
    legajo_prefijo: string;  //agrego pedro
    __v: number;
}
