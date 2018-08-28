import { DocumentoPresentado } from './DocumentoPresentado';

export class CreditoNuevo {
      montoSolicitado: number;
      cobranzaEnDomicilio: boolean;
      tasa: number;
      cantidadCuotas: number;
      diasASumar: number;
      cliente: string;
      garante: string;
      comercio: string;
      token: string;
      documentos: DocumentoPresentado[];
      legajo: string;
      prefijoLegajo: string;
}
