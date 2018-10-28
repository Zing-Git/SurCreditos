export class Session {
  nombreUsuario: string;
  usuario_id: string;
  clave: string;
  token: string;
  rol_id: string;
  rolNombre: string;
  rolPrecendencia: string;
  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);

  }
}
