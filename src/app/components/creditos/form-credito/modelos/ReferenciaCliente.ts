export interface ReferenciaCliente {
  token: string;
  cliente: {
      _id: string,
      referencia: {
        _id: string,
        tipoReferencia: string,
        comentario: string,
        itemsReferencia: any[]
      }
  };



}

