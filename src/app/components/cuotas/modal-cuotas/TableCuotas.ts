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
<<<<<<< HEAD
   
    __v: number;
=======
    __v: 0
>>>>>>> f66bc5f4eea99c3100fb852a290d48813c20bef9
}