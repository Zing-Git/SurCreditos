import { Component, OnInit } from '@angular/core';
import { CuotasService } from '../../modules/servicios/cuotas/cuotas.service';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
// import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


declare let jsPDF;

@Component({
  selector: 'app-rendicion-de-nomina',
  templateUrl: './rendicion-de-nomina.component.html'
})
export class RendicionDeNominaComponent implements OnInit {
  nominas: any = '';
  buttonGuargarDisabled: boolean = false;
  buttonImprimirDisabled: boolean = true;
  texto = '';
  source: any;
  comisionCobrador: any;
  guardado = false;

  dniCobrador: any;
  apellidoCobrador: any;
  token: string;
  idCobrador: string;
  mostrarDetalleAsignacion = false;

  settings = {
    actions: {
      columnTitle: "Nominas",
      add: false,
      delete: false,
      edit: false,
      position: "right",
      custom: [
        {
          name: "seleccionar",
          title: "Seleccionar"
        },
      ]
    },
    columns: {
      fechaNomina: {
        title: "Fecha",
        width: "20%",
        filter: false,
        valuePrepareFunction: (cell, row) => { return moment(row.fechaNomina).format('DD-MM-YYYY') }
      },
      idNomina: {
        title: "Id Nomina",
        width: "20%",
        filter: false
      },
      estadoNomina: {
        title: "Estado",
        width: "20%",
        filter: false
      },
      dniCobrador: {
        title: "Dni",
        width: "10%",
        filter: false
      },
      nombreCobrador: {
        title: "Nombre",
        width: "10%",
        filter: false
      }
    },
    pager: {
      display: true,
      perPage: 5
    }
  };

  // tslint:disable-next-line:max-line-length
  constructor( private cuotasService: CuotasService, private loginService: LoginService, private datePipe: DatePipe, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.dniCobrador = params['dni'];
      this.apellidoCobrador = params['apellido'];
      this.idCobrador = params['idCobrador'];
      this.token = this.loginService.getTokenDeSession();

      this.cuotasService.postGetNominaDeCobranzasPorDni(this.dniCobrador).subscribe( resp => {
        let respuesta = resp['asignaciones'];

        this.crearTablaDeNominasParaSeleccion(respuesta);

      }, error => {
        Swal(
          'No se pudo obtener nominas de cobro del cobrador',
          'Intente con otro cobrador',
          'error'
        );
      });

    });
  }

  crearTablaDeNominasParaSeleccion(zasignaciones: any) {
    let lista = new Array();
    zasignaciones.forEach(element => {
      // console.log(element);
      let tablaAsignaciones = {
        fechaNomina: element.fechaAlta,
        idNomina: element._id,
        estadoNomina: element.estado,
        dniCobrador: element.usuario.persona.dni,
        nombreCobrador: element.usuario.nombreUsuario
      };
      lista.push(tablaAsignaciones);
    });
    this.source = lista;
  }

  onCustom(event) {
    const evento = (`${event.action}`);
    const idNominaElegida = (`${event.data.idNomina}`);
    console.log(idNominaElegida);
    switch (evento) {
      case 'seleccionar': {
        this.onSearch(idNominaElegida);
        break;
      }
    }


  }


  onSearch(idNominaElegida: string = '') {
   let xNominas: any;

   this.cuotasService.postGetNominaDeCobranzas(idNominaElegida).subscribe( resp => {
       xNominas = resp;
       console.log(xNominas);

       let rendicionCobranza = {
        token: this.loginService.getTokenDeSession(),
        usuario: xNominas.asignaciones[0].usuario._id,    // cobrador
        nombreCobrador: xNominas.asignaciones[0].usuario.nombreUsuario, // nombre del cobrador
        idNominaCobranza: xNominas.asignaciones[0]._id,
        cabecera: idNominaElegida,
        totalCobrado: 0,
        asignaciones: []
     };

     xNominas.asignaciones[0].detalleASignacion.forEach(element => {
       let asignacion = {
         legajoCredito: element.credito[0].legajo_prefijo + ' - ' + element.credito[0].legajo,
         dniCliente: element.dni,
         valorDeCuota: element.valorDeCuota,
         fechaAlta: element.fechaAlta,
         saldoACobrar: element.saldoACobrar,
         _id: element._id,
         montoCobrado: element.montoCobrado,
       };
       rendicionCobranza.asignaciones.push(asignacion);
     });

     this.mostrarDetalleAsignacion = true;
     // Carga de Nominas a la tabla
     this.nominas = rendicionCobranza;
     this.calcularTotalCobrado();
     console.log(this.nominas);
   });




  }

  guardarCobro() {
    console.log('GUARDANDO LO SIGUEINTE: ' + this.nominas);
    this.cuotasService.postGuardarNominaDeCobranzas(this.nominas).subscribe( resp => {
      let respuesta = resp;
      console.log(respuesta);


      this.guardado = !this.guardado;

      if (resp.ok) {
        // tslint:disable-next-line:max-line-length
        this.comisionCobrador = 'Comision del Cobrador: ' + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(respuesta.comisionCobrador)).toString();

        Swal({
          title: 'Se guardó correctamente las cobranzas del cobrador',
          text: 'Quieres imprimirla?',
          type: 'success',
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Si, Imprimir!',
          cancelButtonText: 'No, Cancelar'
        }).then((result) => {
          if (result.value) {
            this.imprimirComprobanteNominaPago(respuesta);
          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        });
      } else {
        Swal(
          'Hubo un problema al guardar',
          'Intente nuevamente',
          'error'
        );
      }
    });

    this.buttonImprimirDisabled = false;
    this.buttonGuargarDisabled = true;
  }

  verCobros() {
    console.log(this.nominas);
  }

  calcularTotalCobrado(){

    
    this.nominas.totalCobrado = 0;
    this.nominas.asignaciones.forEach(element => {
      this.nominas.totalCobrado = this.nominas.totalCobrado + element.montoCobrado;
    });
  }
  focusOutFunction(){
    this.calcularTotalCobrado();
  }


  lanzarPopupGuardar() {

    this.calcularTotalCobrado();

    if (this.nominas.asignaciones.length > 0) {
      Swal({
        title: 'Estas seguro de guardar?',
        text: 'Al guardar, ya no podras modificar las cobranzas del cobrador, revisa bien los datos cargados',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this.guardarCobro();
        }
      });
    } else {
      Swal(
        'Para guardar, debe agregar cobranzas a la lista de cobros',
        'No se puede Guardar todavía',
        'error'
      );

    }
  }



  imprimirComprobanteNominaPago(respuesta: any) {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // tslint:disable-next-line:max-line-length
    doc.text('Rendicion de Nomina de Cobros:   ' + this.nominas.nombreCobrador + '  Id: ' +  this.nominas.idNominaCobranza, 80, 15, 'center');
    doc.text('Fecha:   ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy') , 80, 20, 'center');
    let separadorCol1 = 10;
    let separadorCol2 = 190;
    doc.line(separadorCol1, 25, separadorCol2, 25);
    doc.setFontSize(7);
    doc.setTextColor(0);

    let col1 = 20;
    let fila1 = 30;
    let incrementoFila = 3;
    let  i = 0;


    this.nominas.asignaciones.forEach(element => {
       doc.text( 'Legajo: ' + element.legajoCredito, col1, fila1 + (i++ * incrementoFila));
       doc.text( 'Dni Cliente: ' + element.dniCliente, col1, fila1 + (i++ * incrementoFila));
       // tslint:disable-next-line:max-line-length
       doc.text('Valor de Cuota: '  + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.valorDeCuota), col1, fila1 + (i++ * incrementoFila));
       // tslint:disable-next-line:max-line-length
       doc.text( 'Fecha de Orden de Cobro: ' + this.datePipe.transform(element.fechaAlta, 'dd/MM/yyyy'), col1, fila1 + (i++ * incrementoFila));
       // tslint:disable-next-line:max-line-length
       doc.text('Saldo a Cobrar: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.saldoACobrar), col1, fila1 + (i++ * incrementoFila));
       // tslint:disable-next-line:max-line-length
       doc.text('Monto Cobrado: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.montoCobrado), col1, fila1 + (i++ * incrementoFila));

       let filaSeparadora = fila1 + (i++ * incrementoFila);
       // tslint:disable-next-line:max-line-length
       doc.text( '................................................................................................................................................................................................................................................................ ', separadorCol1, filaSeparadora);
    });


    i++;
    // tslint:disable-next-line:max-line-length
    doc.text('Fecha de Rendición: ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy') + '                 ' + 'Monto Pagado Total: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this.nominas.totalCobrado), col1, fila1 + (i++ * incrementoFila));
    // tslint:disable-next-line:max-line-length
    // doc.text('Comision Cobrador: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(respuesta.comisionCobrador), col1, fila1 + (i++ * incrementoFila));
    doc.text(this.comisionCobrador, col1, fila1 + (i++ * incrementoFila));
    i++;
    i++;
    i++;
    // tslint:disable-next-line:max-line-length
    doc.text('Firma Cobrador: ................................................................              Firma Cajero: ................................................................', col1, fila1  + (i++ * incrementoFila));

    doc.save('RENDICION-COBRADOR.pdf');
    let pdfImprimir = doc.output('blob'); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador

  }

  nuevaRendicion(){
    this.nominas = '';
    this.texto = '';

  }
}
