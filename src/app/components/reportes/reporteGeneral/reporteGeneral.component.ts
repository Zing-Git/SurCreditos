import { OnInit, Component } from "@angular/core";
import { DatePipe } from "@angular/common";
import { CajaService } from "src/app/modules/servicios/caja/caja.service";

import { LoginService } from "src/app/modules/servicios/login/login.service";
import { Session } from "src/app/modelo/util/session";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";


declare let jsPDF;

@Component({
  selector: 'app-reporteGeneral',
  templateUrl: './reporteGeneral.component.html',
  styleUrls: ['./reporteGeneral.component.css']
})

export class ReporteGeneral implements OnInit {
  session = new Session();
  cuotaAPagar: any;
  fechasForm: FormGroup;
  constructor(private datePipe: DatePipe, 
    private cajaService: CajaService, 
    private loginService: LoginService,
    private fb: FormBuilder) {


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
      fechaFin: new FormControl('',[Validators.required])
    });
    this.session.token = this.loginService.getTokenDeSession();
    this.cajaService.postGetComboIngresoEgreso(this.session.token).subscribe(result => {
      console.log(result);
    })
  }
}