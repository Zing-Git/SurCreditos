export class Session {
  nombreUsuario: string;
  clave: string;
  token: string;
  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }
}
