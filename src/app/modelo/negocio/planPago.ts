import { Cuota } from './cuota';

export class PlanPago{
    cuotas: Cuota[];
    porcentajeCumplimiento: string;
    finalizado:boolean;
    _id:string;
    CantidadCuotas:number;
    __v:number;
}
