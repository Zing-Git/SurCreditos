import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CajaService } from 'src/app/modules/servicios/caja/caja.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
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

  // operacionForm: FormGroup;

  // Formulario
  selectTipoOperacion: any;
  operacion: any;
  selectedValue: any;
  cajaId: any;
  mostrarMovimiento = false;








  // tslint:disable-next-line:max-line-length
  constructor(private fb: FormBuilder, private cajaService: CajaService, private loginService: LoginService, private datePipe: DatePipe, private router: Router) { }

  ngOnInit() {


    this.token = this.loginService.getTokenDeSession;
    // console.log(this.selectTipoOperacion);
    this.cargarCombos();

  }


  cargarCombos() {
    this.cajaService.postGetComboIngresoEgreso(this.token).subscribe( resp => {

      this.dataCombos = resp;
      console.log(this.dataCombos);
      this.onChangeTipoDeOperacion('INGRESO');
    });



  }

  onChangeTipoDeOperacion(opcionOperacion: string = '') {
    this.selectTipoOperacion = opcionOperacion;
    if (opcionOperacion === 'INGRESO') {
      this.opcionesOperacion = this.dataCombos.combos.itemsIngreso;
      this.selectedValue = this.opcionesOperacion[0];
      console.log(this.selectedValue);
    } else {
      this.opcionesOperacion = this.dataCombos.combos.itemsEgreso;
      this.selectedValue = this.opcionesOperacion[0];
      console.log(this.selectedValue);
    }
  }


  onChangeOperacion() {
    // this.operacion = operacion;
    console.log(this.selectedValue);

  }










  agregarAOperaciones(coment: string = '', monto: number = 0) {
    let operacionInvalida = false;

    if (this.selectedValue.item === 'COBRO DE CUOTA' || this.selectedValue.item === 'RENDICION COBRO DE CUOTA EN DOMICILIO'){
        operacionInvalida = true;
    }

    if (operacionInvalida) {
      Swal(
        'Esta operacion no puede generar un ingreso manual',
        'No se puede Guardar, porque la operacion se registra en alguna de las funciones de caja',
        'info'
      );
    } else {
      const fila = {
        tipoOperacion: this.selectedValue.tipoItem,
        idOperacion: this.selectedValue._id,
        operacion: this.selectedValue.item,
        montoOperacion: monto,
        comentario: coment
      };
      // console.log(fila);
      this.mostrarMovimiento = true;
      this.filasRegistradas.push(fila);
    }
  }


  lanzarPopupGuardar() {

    if (this.filasRegistradas.length > 0) {
      Swal({
        title: 'Estas seguro de guardar?',
        text: 'Los movimientos regristrados no pueden ser eliminador, comprueba la información que se registra',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {

          this.cajaService.postVerificarEstadoDeCaja(this.loginService.getDatosDeSession().usuario_id).subscribe( resp => {
            if (resp.ok) {
              this.cajaId = resp.idApertura;
              this.crearRegistroParaGuardar();
              this.guardar();
            } else {
              Swal(
                'La Caja debe estar abierta para poder guardar un movimiento',
                'No se puede Guardar, intente abrir una caja o volver a ingresar',
                'error'
              );
            }
          });



        }
      });
    } else {
      Swal(
        'Para guardar, debe agregar agregar movimientos de ingreso o egreso a la lista',
        'No se puede Guardar todavía',
        'error'
      );

    }
  }




  crearRegistroParaGuardar() {
    this.operacionesIngresosEgresos = {
      token: this.loginService.getDatosDeSession().token,
      caja: this.cajaId, // TODO: COLOCAR EL VALOR DEL ID DE CAJA ACTUAL
      idUsuario: this.loginService.getDatosDeSession().usuario_id,
      nombreUsuario: this.loginService.getDatosDeSession().nombreUsuario,
      fecha: new Date(),
      operaciones: this.filasRegistradas,
    };
    console.log(this.operacionesIngresosEgresos);
    console.log(JSON.stringify(this.operacionesIngresosEgresos));

  }

  guardar() {




      this.cajaService.postRegistrarMovimiento(this.operacionesIngresosEgresos).subscribe( resp => {
          let resultado = resp;
          console.log(resultado);
          if (!resp.ok) {
            Swal(
              'Hubo un error al guardar, espere un momento y vuelva a intentar',
              'No se puede Guardar todavía',
              'error'
            );
          } else {
            Swal(
              'Se guardó correctamente tus movimientos',
              'Se verán reflejados en informe de cierre de caja',
              'success'
            );

          }


      }, error => {
        Swal(
          'Hubo un error al guardar, espere un momento y vuelva a intentar',
          'No se puede Guardar todavía',
          'error'
        );
      });


  }



  quitarFila(indice: number){
    console.log(indice);
    this.filasRegistradas.splice(indice, 1);
    // splice elimina el elemento de la posicion y el 1 me indica que solo borra un elemento, si omito el 1 borra
    // desde el indice hasta el ultimo elemento (esta bueno para hacer un deshacer, borrar el ultimo elemento como el pop())

  }






}
