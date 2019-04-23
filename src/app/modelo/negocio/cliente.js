"use strict";
exports.__esModule = true;
var Cliente = /** @class */ (function () {
    function Cliente() {
        this.dni = this.getDni();
    }
    Cliente.prototype.getDni = function () {
        return this.titular.dni;
    };
    return Cliente;
}());
exports.Cliente = Cliente;
