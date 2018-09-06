export interface TableCuotas{
    cuotaPagada: boolean;
    montoPagado: string[];
    montoPendienteDePago: number;
    diasRetraso: number;
    comentarios: string[];
    montoInteresPorMora: number;
    cuotaVencida: boolean,
    fechaPago: string[];
    usuarioCobrador: string[];
    pagoInteres: boolean,
    _id: string;
    orden: number;
    montoCapital:number;
    montoInteres: number;
    montoCobranzaADomicilio:number;
    MontoTotalCuota: number;
    fechaVencimiento: string;
   
    __v: number;
}