import { Cuota } from './cuota';
import { TipoPlan } from './tipoPlan';

export class PlanPago{
    cuotas: Cuota[];
    porcentajeCumplimiento: string;
    finalizado:boolean;
    _id:string;
    CantidadCuotas:number;
    tipoPlan: TipoPlan;
    __v:number;
}
