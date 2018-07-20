export class UsuarioAux{
  _id: string;
  persona: string;	//codigo ID en respuesta a un alta previa de Persona
  nombreUsuario: string;
  clave: string;
  rol: string; 	//obtenido de una consulta de Get Roles
  contactos: string[]; //collection de strings  // cada string es un codigo ID en respuesta a una alta de contacto.
  // estado: boolean;
  __v: number;

  constructor(values: Object = {}) {
    // Constructor initialization
    Object.assign(this, values);
  }


}
