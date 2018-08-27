export class NewSession{
    _id: string;
    token:string;

    constructor(values: Object = {}) {
        // Constructor initialization
        Object.assign(this, values);
    
      }
}