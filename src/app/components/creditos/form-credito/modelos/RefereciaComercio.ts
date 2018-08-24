export interface ReferenciaComercio {
  token: string;
  comercio: {
      id: string,
      referencia: {
        _id: string,
        tipoReferencia: string,
        comentario: string,
        itemsReferencia: any[]
      }
  };
}
