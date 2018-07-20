export class EstadoCasa {
  _id: string;
  nombre: string;
  __v: number;

  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }
}

