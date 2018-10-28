import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CajaService } from 'src/app/modules/servicios/caja/caja.service';
declare let jsPDF;

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
})
export class IngresoEgresoComponent implements OnInit {
  token: any;
  dataCombos: any;
  opcionesOperacion: any[];
  filasRegistradas: any[] = [];
  operacionesIngresosEgresos: any;
  fecha = new Date();

  //Formulario
  selectTipoOperacion: string;
  operacion: string;



  // tslint:disable-next-line:max-line-length
  constructor(private cajaService: CajaService, private loginService: LoginService, private datePipe: DatePipe, private router: Router) { }

  ngOnInit() {
    this.token = this.loginService.getTokenDeSession;
    this.cargarCombos();
  }


  cargarCombos() {
    this.dataCombos = this.cajaService.postGetComboIngresoEgreso(this.token);
    console.log(JSON.stringify(this.dataCombos));
  }

  onChangeTipoDeOperacion(opcionOperacion: string = '') {
    this.selectTipoOperacion = opcionOperacion;
    if (opcionOperacion === 'INGRESO') {
      this.opcionesOperacion = this.dataCombos.ingresos;
    } else {
      this.opcionesOperacion = this.dataCombos.egresos;
    }
  }
  onChangeOperacion(operacion: string = '') {
    this.operacion = operacion;
  }

  agregarAOperaciones(coment: string = '', monto: number = 0) {
    const fila = {
      tipoOperacion: this.selectTipoOperacion,
      operacion: this.operacion,
      monto: monto,
      comentario: coment
    };
    console.log(fila);
    this.filasRegistradas.push(fila);
  }

  guardar(){

    this.operacionesIngresosEgresos = {
      token: this.loginService.getDatosDeSession().token,
      idCaja: '1', // TODO: COLOCAR EL VALOR DE LA CAJA ACTUAL
      idUsuario: this.loginService.getDatosDeSession().usuario_id,
      nombreUsuario: this.loginService.getDatosDeSession().nombreUsuario,
      fecha: new Date(),
      operaciones: this.filasRegistradas,
    };

    console.log(this.operacionesIngresosEgresos);
    console.log(JSON.stringify(this.operacionesIngresosEgresos));

  }

  quitarFila(indice: number){
    console.log(indice);
    this.filasRegistradas.splice(indice, 1);
    // splice elimina el elemento de la posicion y el 1 me indica que solo borra un elemento, si omito el 1 borra
    // desde el indice hasta el ultimo elemento (esta bueno para hacer un deshacer, borrar el ultimo elemento como el pop())

  }






}
