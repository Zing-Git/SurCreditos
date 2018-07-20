export class Rol {
  _id: string;
  nombre: string;
  precedencia: number;
  __v: number;

  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }
}
