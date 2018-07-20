export class Contacto{
  _id: string;
  tipoContacto: string;
  codigoPais: string;
  codigoArea: string;
  numeroCelular: string;
  email: string;
  __v: number;

  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }
}
