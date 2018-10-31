import { OnInit, Component } from "@angular/core";
import { DatePipe } from "@angular/common";

import { LoginService } from "src/app/modules/servicios/login/login.service";
import { Session } from "src/app/modelo/util/session";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { CreditosService } from "src/app/modules/servicios/creditos/creditos.service";

import 'jspdf-autotable';
declare let jsPDF;
import Swal from 'sweetalert2';
import { UtilidadesService } from "src/app/modules/servicios/utiles/utilidades.service";

@Component({
  selector: 'app-reporteCreditos',
  templateUrl: './reporteCreditos.component.html',
})
export class ReporteCreditos implements OnInit {

  session = new Session();
  creditos: any;
  creditosViewModel: any;
  //Campos de la vista
  fechaCredito: any;
  cantidadCreditos: any;
  montoTotalCreditos: any;

  fechaActual: any = (this.datePipe.transform(new Date(Date.now()), 'dd/MMM/yyyy'));
  clientesActivos: any;
  clientesInactivos: any;
  fechasForm: FormGroup;

  bandera: boolean =false;

  settings = {

    actions: {
      //columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,

    },
    columns: {
      fechaAlta: {
        title: 'Fecha Alta',
        width: '20%',
        filter: false,
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
      },
      cantidadCreditos: {
        title: 'Cantidad de Creditos',
        width: '30%',
        filter: false
      },

      montoCredito: {
        title: 'Monto Total de Credito',
        width: '50%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoCredito' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      }
    },
    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'No hay creditos entre las Fechas...'
  };


  constructor(private datePipe: DatePipe,
    private creditoService: CreditosService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private auxiliar: UtilidadesService) {


  }

  imprimirPDF() {
    const doc = new jsPDF();
    let numeroFactura: string;
    let nextPag = 0;


    if (nextPag > 0) {
      doc.addPage();
    } else {
      nextPag += 1;
    }
    //Encabezado
    doc.setFontSize(12);

    doc.setFontType("bold");
    doc.text('CUPON DE PAGO', 80, 30, 'center');
    doc.line(10, 35, 150, 35);   //x, y, largo , y
    doc.setFontSize(8);
    doc.setTextColor(0)


    //Detalle 
    //console.log();
    doc.setFontType("normal")

    doc.text('Legajo de Credito: ', 10, 40);
    doc.text('Titular: ', 10, 50);
    doc.text('Domicilio: ', 10, 55);
    doc.text('Dni: ', 100, 50);
    doc.text('Telefono:     ', 10, 60);
    doc.text('Fecha de Alta: ', 10, 65);
    doc.text('Fecha de Cancelacion: ', 80, 65);
    doc.text('Capital: ', 10, 70);
    doc.text('Total a Pagar: ', 80, 70);
    doc.text('Plan de Pago: ', 10, 75);
    doc.text('Cant. de Cuotas: ', 80, 75);
    doc.line(10, 80, 150, 80);
    //datos de la cuota usamos x

    doc.text('Nº Cuota: ', 40, 90);
    doc.text('Valor de Cuota:', 40, 95);
    doc.text('Dias mora: ', 40, 100);
    doc.text('Total a Pagar: ', 40, 105);
    doc.text('Pagado: ', 40, 110);
    doc.text('Saldo por cuota: (adeudado):', 40, 115);
    doc.text('Saldo Total del Credito:', 40, 123)
    doc.text('Fecha de Pago: ', 80, 128)
    doc.setFontType("bold");



    //doc.text(this.datePipe.transform(element.fechaAlta, 'dd/MM/yyyy'), 50, 65);


    //doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
    //  .format(+element.capital), 50, 70);  //Capital

    //parte de la cuota
    /*doc.setFontSize(12);
    doc.line(10, 125, 150, 125);
    doc.line(10, 135, 150, 135);
    doc.setFontType("bold");
 
    //****************************************FIN DE CUPON PARA CAJERO  ******************************************** 
    doc.text('CUPON DE PAGO', 80, 145, 'center');
    doc.line(10, 150, 150, 150);   //x, y, largo , y
    doc.setFontSize(8);
    doc.setTextColor(0)
 
    doc.setFontType("normal")*/


    //parte de la cuota
    doc.setFontSize(12);
    doc.line(10, 245, 150, 245);

    //doc.line(10, 235, 150, 235);

    doc.save('CuponDePago.pdf');
    let pdfImprimir = doc.output("blob"); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador


  }



  ngOnInit(): void {
    this.fechasForm = this.fb.group({
      fechaInicio: new FormControl('', [Validators.required]),
      fechaFin: new FormControl('', [Validators.required])
    });
    this.session.token = this.loginService.getTokenDeSession();
    this.creditoService.postGetAllCreditosTodosLosUsuarios(this.session).subscribe(result => {
      this.creditos = result["credito"];
    })
  }


  getData() {
    console.log(this.creditos);

    this.bandera = true;
    let fechaInicio = new Date(this.datePipe.transform(this.fechasForm.get('fechaInicio').value, 'yyyy-MM-dd'));
    let fechaFin = new Date(this.datePipe.transform(this.fechasForm.get('fechaFin').value, 'yyyy-MM-dd'));
    let fecha = new Date();

    this.creditosViewModel = new Array();
    let fechaSiguiente = new Date();
    this.montoTotalCreditos = 0;
    this.cantidadCreditos = 0;
    let banderaInicial = 0;

    for (var i = 0; i < this.creditos.length; i++) {

      fecha = new Date(this.datePipe.transform(this.creditos[i].fechaAlta, 'yyyy-MM-dd'));
      
      if (fecha.valueOf() >= fechaInicio.valueOf() && fecha.valueOf() <= fechaFin.valueOf()) {
       
        banderaInicial = 1;
        if (i === (this.creditos.lenght - 1)) {


          if (this.cantidadCreditos > 0) {
            this.montoTotalCreditos = this.montoTotalCreditos + (this.creditos[i].cantidadCuotas * this.creditos[i].valorCuota);
            this.cantidadCreditos += 1;

            this.creditosViewModel.push({
              fechaAlta:this.datePipe.transform(this.creditos[i].fechaAlta, 'yyy-MM-dd'),
              cantidadCreditos: this.cantidadCreditos,
              montoCredito: this.montoTotalCreditos
            })

          } else {


            this.creditosViewModel.push({
              fechaAlta: this.datePipe.transform(this.creditos[i].fechaAlta, 'yyy-MM-dd'),
              cantidadCreditos: 1,
              montoCredito: (this.creditos[i].cantidadCuotas * this.creditos[i].valorCuota)
            })

          }
          break;
        } else {

          fechaSiguiente = new Date(this.datePipe.transform(this.creditos[i + 1].fechaAlta, 'yyyy-MM-dd'))
          
      console.log(fecha);
      console.log(fechaSiguiente);
          if (fecha.valueOf() === fechaSiguiente.valueOf()) {
            console.log('Entro');
            this.montoTotalCreditos = this.montoTotalCreditos + (this.creditos[i].cantidadCuotas * this.creditos[i].valorCuota);
            this.cantidadCreditos += 1;

          } else {

            if (this.cantidadCreditos > 0) {

              this.montoTotalCreditos = this.montoTotalCreditos + (this.creditos[i].cantidadCuotas * this.creditos[i].valorCuota);
              this.cantidadCreditos += 1;

              this.creditosViewModel.push({
                fechaAlta: this.datePipe.transform(this.creditos[i].fechaAlta, 'yyy-MM-dd'),
                cantidadCreditos: this.cantidadCreditos,
                montoCredito: this.montoTotalCreditos
              })

              this.cantidadCreditos = 0;
              this.montoTotalCreditos = 0;

            } else {
              this.creditosViewModel.push({
                fechaAlta: this.datePipe.transform(this.creditos[i].fechaAlta, 'yyy-MM-dd'),
                cantidadCreditos: 1,
                montoCredito: (this.creditos[i].cantidadCuotas * this.creditos[i].valorCuota)
              })
              this.cantidadCreditos = 0;
              this.montoTotalCreditos = 0;
            }

          }
        }
      } else {
        if (banderaInicial === 1) {
          if (this.cantidadCreditos > 0) {

            this.creditosViewModel.push({
              fechaAlta: this.datePipe.transform(this.creditos[i].fechaAlta, 'yyy-MM-dd'),
              cantidadCreditos: this.cantidadCreditos,
              montoCredito: this.montoTotalCreditos
            })

            this.cantidadCreditos = 0;
            this.montoTotalCreditos = 0;

          }
        }
      }
    }
    console.log(this.creditosViewModel);
    //console.log(this.datePipe.transform(this.fechasForm.get('fechaInicio').value, 'dd/MM/yyyy'));
    //console.log(this.datePipe.transform(this.fechasForm.get('fechaFin').value, 'dd/MM/yyyy'));
  }

  onCustom(event) {
    //alert(`Custom event '${event.action}' fired on row №: ${event.data._id}`);
    const evento = (`${event.action}`);
    const dni = (`${event.data.dni}`);
    const id = (`${event.data._id}`);
  }

  calcular(){
    this.clientesActivos = 0;
    this.clientesInactivos = 0;
    this.creditos.forEach(x =>{
      if(x.cliente.estado){
        this.clientesActivos +=1
      }else{
        this.clientesInactivos +=1;
      }
        
    })
    
}

  showReporteCliente(){
    this.calcular();
    let texto : string;
    if(this.clientesActivos > 0 && this.clientesInactivos > 0){
        texto= '<strong> Clientes al ' + this.fechaActual + '<br>' + ' Activos es un Total de :   ' + this.clientesActivos + '</strong>' + '<br>' + ' Inactivos es un Total de :   ' + this.clientesInactivos;
    }else{
      if(this.clientesInactivos > 0){
        texto= '<strong> Clientes Inactivos al ' + this.fechaActual + '<br>' + ' es un Total de :   ' + this.clientesInactivos + '</strong>';
      }else{
        if(this.clientesActivos > 0){
          texto= '<strong> Clientes Activos al ' + this.fechaActual + '<br>' + ' es un Total de :   ' + this.clientesActivos + '</strong>';
        }
      }
    }
    
    Swal({
      title: 'Clientes Activos',
      
      html: '<strong>' + texto + '</strong>',
      type: 'success',
      showCancelButton: false,
      reverseButtons: true,
      confirmButtonText: 'Ok!',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.value) {
        //this.imprimirCuponesDePago();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });

  }

  generarXls(): void{
    this.auxiliar.exportAsExcelFile(this.creditosViewModel, 'reporteCredito');
  }
  
}
