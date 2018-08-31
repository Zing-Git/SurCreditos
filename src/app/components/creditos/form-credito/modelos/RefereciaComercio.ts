export interface ReferenciaComercio {
  token: string;
  comercio: {
      _id: string,
      referencia: {
        _id: string,
        tipoReferencia: string,
        comentario: string,
        itemsReferencia: any[]
      }
  };
}
