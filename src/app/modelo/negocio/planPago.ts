import { Cuota } from './cuota';

export class PlanPago{
    cuotas: Cuota[];
    porcentajeCumplimiento: string;
    finalizado: boolean;
    _id: string;
    CantidadCuotas: number;
    __v: number;

    tipoPlan: {
      plan: any [],
      id: string,
      nombre: string,
      diasASumar: number,
      orden: number,
      __v: number
    };
}





