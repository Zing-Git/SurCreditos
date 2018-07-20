export class Persona {
  _id: string;
  tipoDni: string;
  dni: string;
  apellidos: string;
  nombres: string;
  domicilio: string;
  fechaNacimiento: string;
  fechaAlta: string;
  __v: number;

  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }

}
