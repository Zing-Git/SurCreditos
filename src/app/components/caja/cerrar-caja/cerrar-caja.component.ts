import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import Swal from 'sweetalert2';
import { CajaService } from 'src/app/modules/servicios/caja/caja.service';
import 'jspdf-autotable';
declare let jsPDF;
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cerrar-caja',
  templateUrl: './cerrar-caja.component.html',
})
export class CerrarCajaComponent implements OnInit {
  caja: any = '';
  movimientos: any[];
  montoFinal: any;
  mostrarImpresion = false;

  constructor(private loginService: LoginService, private cajaService: CajaService, private datePipe: DatePipe) { }

  ngOnInit() {

    this.caja = this.loginService.getCaja();

  }

  cerrarCaja() {

    if (this.loginService.getIdCaja() === '0') {
      Swal(
        'La caja ya esta cerrada',
        'Antes de cerrar una caja, debes abrirla, hacer operaciones y finalmente cerrarla',
        'info'
      );
    } else {
      let token = this.loginService.getTokenDeSession();
      this.cajaService.postCerrarCaja(token).subscribe( resp => {
          // console.log(resp);
          if (resp.ok) {
            this.loginService.setCierreDeCaja(); // se blanquea las variables de session
            this.caja = this.loginService.getCaja();
            Swal(
              'La caja se cerró correctamente',
              'Ahora pueedes abrir una nueva caja en cualquier momento',
              'success'
            );
            this.mostrarImpresion = true;
            this.mostrarTabla(resp);
          } else {
            Swal(
              'No se pudo cerrar la caja',
              resp.message,
              'error'
            );
          }
      }, error => {
          Swal(
            'No se pudo cerrar la caja',
            'A veces hay problemas de conexion o de servidor, intentelo en un momento',
            'error'
          );
      });
    }
  }


  mostrarTabla(datos: any) {
    this.movimientos = datos.movimientos;
    this.montoFinal = datos.montoFinal;

  }


  imprimirCaja() {


      const doc = new jsPDF();
      doc.setFontSize(12);

      // tslint:disable-next-line:max-line-length
      doc.text('CIERRE DE CAJA:   ' + this.loginService.getCaja(), 80, 15, 'center');
      doc.text('Fecha:   ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy') , 80, 20, 'center');
      let separadorCol1 = 10;
      let separadorCol2 = 190;
      doc.line(separadorCol1, 25, separadorCol2, 25);
      doc.setFontSize(9);
      doc.setTextColor(0);

      let col1 = 20;
      let fila1 = 30;
      let incrementoFila = 3;
      let  i = 0;

      let filaTabla = 1;
      this.movimientos.forEach(element => {
         doc.text( 'Orden: ' + filaTabla++ , col1, fila1 + (i++ * incrementoFila));
         doc.text( 'Tipo: ' + element.tipo, col1, fila1 + (i++ * incrementoFila));
         doc.text( 'Operación: ' + element.operacion, col1, fila1 + (i++ * incrementoFila));
         // tslint:disable-next-line:max-line-length
         doc.text('Monto: '  + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.monto), col1, fila1 + (i++ * incrementoFila));
         // tslint:disable-next-line:max-line-length
         doc.text( 'Fecha: ' + this.datePipe.transform(element.fecha, 'dd/MM/yyyy, h:mm a'), col1, fila1 + (i++ * incrementoFila));

         let filaSeparadora = fila1 + (i++ * incrementoFila);
         // tslint:disable-next-line:max-line-length
         doc.text( '............................................................................................................................................... ', separadorCol1, filaSeparadora);
      });


      i++;
      doc.setFontSize(10);
      // tslint:disable-next-line:max-line-length
      doc.text('Fecha de Rendición: ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy') + '                 ' + ' Total Resultado de Caja: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this.montoFinal), col1, fila1 + (i++ * incrementoFila));
      // tslint:disable-next-line:max-line-length
      i++;
      i++;
      i++;
      // tslint:disable-next-line:max-line-length
      doc.text('Firma Cajero: ......................................              Firma Administrativo: .....................................', col1, fila1  + (i++ * incrementoFila));

      doc.save('RENDICION-CAJERO.pdf');
      let pdfImprimir = doc.output('blob'); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
      window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador



  }

}
