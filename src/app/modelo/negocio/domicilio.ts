import { EstadoCasa } from './estado-casa';
export class Domicilio {
        _id: string;
        pais: string; 		// Por defecto dejar Argentina
        provincia: string; //obtenido de una consulta de Get Provincias
        localidad: string; //Idem
        barrio: string;
        calle: string;
        numeroCasa: string;
        estadoCasa: string; //obtenido de una consulta de Get Estado Casa
        __v: number;

        constructor(values: Object = {}) {
          // Constructor initialization
          Object.assign(this, values);
        }

}
