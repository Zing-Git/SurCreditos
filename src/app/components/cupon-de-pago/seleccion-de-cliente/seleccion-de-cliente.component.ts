import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { Session } from '../../../modelo/util/session';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { ElegirCuotasComponent } from '../elegir-cuotas/elegir-cuotas.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ModalCuotasCobranzaComponent } from '../modal-cuotas-cobranza/modal-cuotas-cobranza.component';
import { AsignacionDeCobranza } from '../asignacionDeCobranza';
import { TokenPost } from '../../../modelo/util/token';
import { LocalDataSource } from 'ng2-smart-table';
import { CuotasService } from '../../../modules/servicios/cuotas/cuotas.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import 'jspdf-autotable';
declare let jsPDF;

@Component({
  selector: 'app-seleccion-de-cliente',
  templateUrl: './seleccion-de-cliente.component.html'
})
export class SeleccionDeClienteComponent implements OnInit {
  @ViewChild(ElegirCuotasComponent) hijo: ElegirCuotasComponent;
  @ViewChild(ModalCuotasCobranzaComponent) hijoModal: ModalCuotasCobranzaComponent;

  buttonGuargarDisabled: boolean = false;
  buttonImprimirDisabled: boolean = true;


  dniCobrador: any;
  apellidoCobrador: any;
  session = new Session();
  characters: any[];
  cobranzasAClientes: any[];
  idCobrador: string;

  dniCliente: string;
  nombreApellidoCliente: string;
  direccionCliente: string;


  source: LocalDataSource;

  source2: LocalDataSource;


  cobranzaAsignadaACobrador: AsignacionDeCobranza;  // contiene una cobranza de un cobrador
  cobranzasCobradores: any[]; // contiene todas las cobranzas de los cobradores
  asignaciones: any[] = []; // contiene las asignaciones que se van cargando para cobrar
  // asignacionesParaDataTable: any[] = []; // contiene las asignaciones que se van cargando para cobrar
  cantidadCobranzas: number;
  idAsignacionCobrazaGuardada: string;


  settings = {
    actions: {
      columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',
      custom: [
        {
          name: 'Carga de Cuotas',
          title: 'Cargar Cobro'
        }
      ],
    },
    columns: {
        dni: {
        title: 'Dni',
        width: '10%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.dni
      },
      nombreCompleto: {
        title: 'Apellido y Nombre',
        width: '25%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.apellidos + ', ' + row.nombres
      },
      localidad: {
        title: 'Localidad',
        width: '17%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.domicilio.localidad
      },
      barrio: {
        title: 'Barrio',
        width: '10%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.domicilio.barrio
      },
      calle: {
        title: 'Calle',
        width: '15%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.domicilio.calle
      },
      numeroCasa: {
        title: 'Numero',
        width: '8%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.domicilio.numeroCasa
      }

    },
    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'Esperando lista de clientes activos...'
  };



  settings2 = {
    actions: {
      columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',
    },
    columns: {
      dni: {
        title: 'Dni',
        width: '10%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.cliente.dni
      },
      nombreApellido: {
        title: 'Cliente',
        width: '20%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.cliente.nombreApellido
      },
      direccion: {
        title: 'Direccion',
        width: '30%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.cliente.direccion
      },
      legajoCredito: {
        title: 'Legajo',
        width: '5%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.creditos[0].legajoCredito
      },
      valorDeCuota: {
        title: 'Cuota',
        width: '10%',
        filter: false,
        sort: true,
        /* valuePrepareFunction: (cell, row) => row.creditos[0].valorDeCuota */
        valuePrepareFunction: (cell, row) => {
           return Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(row.creditos[0].valorDeCuota);
        }

      },
      saldoACobrar: {
        title: 'Saldo',
        width: '10%',
        filter: false,
        sort: true,
        // valuePrepareFunction: (cell, row) => row.creditos[0].saldoACobrar
        valuePrepareFunction: (cell, row) => {
          return Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(row.creditos[0].saldoACobrar);
        }
      },
      cuotasAdeudadas: {
        title: 'C. a cobrar',
        width: '15%',
        filter: false,
        sort: true,
        valuePrepareFunction: (cell, row) => row.creditos[0].cuotasAdeudadas
      }
    },
    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'Esperando asignaciones de cobros...'
  };


  constructor(
    private router: ActivatedRoute,
    private loginService: LoginService,
    private clientesService: ClientesService,
    public ngxSmartModalService: NgxSmartModalService,
    private cuotasService: CuotasService,
    private datePipe: DatePipe,

  ) {}

  ngOnInit() {
    const pen: Object = {
      prop1: 'test',
      prop2: true,
      prop4: 327652175423
    };
    this.ngxSmartModalService.setModalData(pen, 'popupOne');

    this.router.params.subscribe(params => {
      this.dniCobrador = params['dni'];
      this.apellidoCobrador = params['apellido'];
      this.idCobrador = params['idCobrador'];

      this.session.token = this.loginService.getTokenDeSession();
      this.cargarClientesActivos();

    });
    this.cantidadCobranzas = 0;
  }



  cargarClientesActivos() {



    this.clientesService
      .postGetClientesActivos(this.session)
      .subscribe(resp => {
        this.characters = resp['clientes'];
        console.log(this.characters);
        this.source = new LocalDataSource(this.characters); // create the source
      });


  }
/*
  buscarCreditosVigentes() {

      this.creditosServices.postGetCreditosVigentes(this.session, dni).subscribe(response => {
          let charactersCreditos = response['creditos'];


            // console.log(characters);
          if (typeof charactersCreditos === 'undefined') {
            swal('Advertencia', 'Credito esta pagada o no existe!!', 'warning');
          } else {
            // this.charactersCreditos = characters;
            this.charactersCreditos = JSON.parse(JSON.stringify(charactersCreditos));
            // this.charactersCreditos = Object.assign({}, characters);
          }

        });
  } */



  onCustom(event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.dni}`);
    const evento = (`${event.action}`);
    const dni = (`${event.data.dni}`);
    this.dniCliente = (`${event.data.dni}`);
    this.nombreApellidoCliente = (`${event.data.apellidos}`) + ', ' + (`${event.data.nombres}`);
    // tslint:disable-next-line:max-line-length
    this.direccionCliente = (`${event.data.domicilio.localidad}`) + ' - ' + (`${event.data.domicilio.calle}`) + ' - ' + (`${event.data.domicilio.numeroCasa}`);

    // console.log('NOMBRE CLIENTE: ' + this.nombreApellidoCliente);
    // console.log('DIRECCION: ' + this.direccionCliente);

    switch (evento) {
      case 'Carga de Cuotas': {
        console.log( 'DNI CLIENTE ELEGIDO: ' + dni);

        this.mostrarCuotas(dni);
        break;
      }
    }




  }

  // COMUNICACION CON EL HIJO MODAL-------------------------

  mostrarCuotas(dni: any) {
    this.ngxSmartModalService.getModal('popupOne').open();
    this.hijo.buscarCreditoPorDni(dni);
  }

  enviarMensaje() {
    // this.hijo.saludo('hola desde el padre');
  }



  // finalizar toma datos del hijo modal-cuotas-cobranza
  // es el proceso final, cuando ya elige las cuotas a cobrar viene de nuevo al padre
  // para que se carguen las cuotas y se imprima
  finalizar(event) {
    // console.log('viene del hijo de modal-cuotas-cobranza..........');

    this.ngxSmartModalService.getModal('popupTwo').close();
    this.cargarCobranzaACobrador(event);


  }

  // verCuotasCredito recibe datos desde el hijo elegir-cuotas y llama al modal-cuotas pasandole parametros recibidos
  verCuotasDeCredito(event) {
    this.ngxSmartModalService.getModal('popupOne').close();
    // console.log('viene del hijo de elegir cuota..........');
/*     console.log(event[0]);
    console.log(event[1]);
    console.log(event[2]);
    console.log(event[3]); */

    // this.hijoModal.getDataFromCuotas(this.cuotas, this.charactersCreditos, idCredito, this.session.token);
    this.hijoModal.getDataFromCuotas(event[0], event[1], event[2], event[3]);
    this.ngxSmartModalService.getModal('popupTwo').open();

  }

  cargarCobranzaACobrador(cobros: any) {
    // console.log(cobros);


    if (!this.cobranzaAsignadaACobrador) { // Encabezado-----------------------------------------------------------

      /* alert('Primera vuelta: ' + this.cantidadCobranzas.toString()); */
      this.cobranzaAsignadaACobrador = new AsignacionDeCobranza();
      this.cobranzaAsignadaACobrador.token = cobros[3];
      this.cobranzaAsignadaACobrador.usuario = this.idCobrador;
      this.cobranzaAsignadaACobrador.usuarioCobradorNombre = this.apellidoCobrador;
      this.cobranzaAsignadaACobrador.fechaEmision = (new Date(Date.now())).toString();
      this.generarUnaAsignacionDeCobroParaCobrador(cobros);

      this.cantidadCobranzas++;
    } else { // Detalle, se cargan todos los asignaciones de cobranzas de los clientes al cobrador------------------
      /* alert('Segunda vuelta: '  + this.cantidadCobranzas.toString()); */
      this.generarUnaAsignacionDeCobroParaCobrador(cobros);

      this.cantidadCobranzas++;
    }

  }

  generarUnaAsignacionDeCobroParaCobrador(cobros: any) {
    const creditoACobrar = (cobros[1])[0];
    const cuotasId = [];
    let xcuotasAdeudadas = '';
    let xsaldoACobrar = 0;

    // console.log(cobros[4]);

    cobros[4].forEach(element => {
      // console.log('Cuotas Id:' + element._id);
      let xcuotaJson: Object = {
        _id: element._id,
      };
      cuotasId.push(xcuotaJson);

      xcuotasAdeudadas = xcuotasAdeudadas + element.orden + ', ';
      xsaldoACobrar = xsaldoACobrar + element.montoPendienteDePago;
    });






    const xcredito = {
      _id: creditoACobrar._id,
      legajoCredito: creditoACobrar.legajoPrefijo + '-' + creditoACobrar.legajo,
      valorDeCuota: creditoACobrar.cuotas[0].MontoTotalCuota, // es el valor de cada cuota que se paga en el credito
      saldoACobrar: xsaldoACobrar, // se suman los montos de las cuotas cargadas.
      interes: xsaldoACobrar - creditoACobrar.cuotas[0].MontoTotalCuota,
      cuotas: cuotasId,   // cuotas a cobrar por el cobrador
      fechaCancelacionCredito: creditoACobrar.cuotas[creditoACobrar.cuotas.length - 1].fechaVencimiento,
      cuotasAdeudadas: xcuotasAdeudadas // enumeracion del numero de cuotas ej: 5,6,7
    };

    const xcreditos = [];
    xcreditos.push(xcredito);

    const asignacion = {
        cliente : {
            dni: this.dniCliente,
            nombreApellido: this.nombreApellidoCliente,
            direccion: this.direccionCliente
        },
        creditos: xcreditos,
    };

    this.asignaciones.push(asignacion);
    // console.log(this.asignaciones);
    // this.cargarAsignacionParaDataTable(asignacion);
    // this.asignacionesParaDataTable.push(asignacion);



    // tslint:disable-next-line:max-line-length
    // Se eliminar el cliente de la tabla: ---------------------------------------------- SI FUNCIONA, LO SAQUE PORQUE ES MEJOR USAR EL BUSCAR PARA PREPARAR LA NOMINA
    // let objetoAEliminar =  this.characters.find(x => x.dni === this.dniCliente); // busca el objeto a eliminar con dni especifico
    // console.log( 'Eliminar:::: ' , eliminar);
    // this.characters = this.characters.filter(obj => obj !== objetoAEliminar);  // filtra la tabla mostrando todos menos el objeto eliminar
    // FIN eliminar el cliente de la tabla: ----------------------------------------------



    this.source2 = new LocalDataSource();
    this.source2.load(this.asignaciones);


  }

  cargarAsignacionParaDataTable(asignacionNueva: any) {

  }
  /* verJson() {
    console.log(JSON.stringify(this.cobranzaAsignadaACobrador));
    console.log(JSON.parse(JSON.stringify(this.cobranzaAsignadaACobrador)));
  } */



  imprimirCuponesDePago() {



      let xNominaCobrador = this.cobranzaAsignadaACobrador;


      const doc = new jsPDF();
      doc.setFontSize(12);

      /* doc.setFontType('bold'); */
      doc.text('Nomina de Cobros:   ' + xNominaCobrador.usuarioCobradorNombre + '  Id: ' +  this.idAsignacionCobrazaGuardada, 80, 15, 'center');

      let separadorCol1 = 10;
      let separadorCol2 = 190;
      doc.line(separadorCol1, 20, separadorCol2, 20);
      doc.setFontSize(7);
      doc.setTextColor(0);

      let col1 = 20;
      let fila1 = 30;
      let incrementoFila = 3;
      let incrementoFila2 = 5; // para firma o llenado a mano
      let  i = 0;

      let icopia = 0;
      let col2Copia = 100;

      let telefinoSurCreditos = '388 15649515';
      let mailSurCreditos = 'surcreditos@gmail.com';

      xNominaCobrador.asignaciones.forEach(element => {
        // Original y Copia
        doc.text('Sur Creditos', col1, fila1 + (i++ * incrementoFila));
        doc.text('Sur Creditos', col2Copia, fila1 + (icopia++ * incrementoFila));

        doc.text('Tel: ' + telefinoSurCreditos + ' - Mail: ' + mailSurCreditos, col1, fila1 + (i++ * incrementoFila));
        doc.text('Tel: ' + telefinoSurCreditos + ' - Mail: ' + mailSurCreditos, col2Copia, fila1 + (icopia++ * incrementoFila));


        doc.text('Cobrador: ' + xNominaCobrador.usuarioCobradorNombre, col1, fila1 + (i++ * incrementoFila));
        doc.text('Cobrador: ' + xNominaCobrador.usuarioCobradorNombre, col2Copia, fila1 + (icopia++ * incrementoFila));

        doc.text('Emisión: ' + this.datePipe.transform(xNominaCobrador.fechaEmision, 'dd/MM/yyyy'), col1, fila1 + (i++ * incrementoFila));
        // tslint:disable-next-line:max-line-length
        doc.text('Emisión: ' + this.datePipe.transform(xNominaCobrador.fechaEmision, 'dd/MM/yyyy'), col2Copia, fila1 + (icopia++ * incrementoFila));

        doc.text('Cliente: ' + element.cliente.nombreApellido, col1 , fila1 + (i++ * incrementoFila));
        doc.text('Cliente: ' + element.cliente.nombreApellido, col2Copia , fila1 + (icopia++ * incrementoFila));

        doc.text('Dni: ' + element.cliente.dni, col1, fila1 + (i++ * incrementoFila));
        doc.text('Dni: ' + element.cliente.dni, col2Copia, fila1 + (icopia++ * incrementoFila));

        doc.text('Dirección: ' + element.cliente.direccion, col1, fila1 + (i++ * incrementoFila));
        doc.text('Dirección: ' + element.cliente.direccion, col2Copia, fila1 + (icopia++ * incrementoFila));



        element.creditos.forEach(element2 => {
          // Original y Copia
          doc.text( 'Legajo: ' + element2.legajoCredito, col1, fila1 + (i++ * incrementoFila));
          doc.text( 'Legajo: ' + element2.legajoCredito, col2Copia, fila1 + (icopia++ * incrementoFila));

          // tslint:disable-next-line:max-line-length
          doc.text('Cuota: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element2.valorDeCuota), col1, fila1 + (i++ * incrementoFila));
          // tslint:disable-next-line:max-line-length
          doc.text('Cuota: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element2.valorDeCuota), col2Copia, fila1 + (icopia++ * incrementoFila));

          // tslint:disable-next-line:max-line-length
          doc.text('A Cobrar: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element2.saldoACobrar), col1, fila1 + (i++ * incrementoFila));
          // tslint:disable-next-line:max-line-length
          doc.text('A Cobrar: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element2.saldoACobrar), col2Copia, fila1 + (icopia++ * incrementoFila));

          // tslint:disable-next-line:max-line-length
          doc.text('Interés: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element2.interes), col1, fila1 + (i++ * incrementoFila));
          // tslint:disable-next-line:max-line-length
          doc.text('Interés: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element2.interes), col2Copia, fila1 + (icopia++ * incrementoFila));

          doc.text('Cuotas a Cobrar: ' + element2.cuotasAdeudadas, col1, fila1 + (i++ * incrementoFila));
          doc.text('Cuotas a Cobrar: ' + element2.cuotasAdeudadas, col2Copia, fila1 + (icopia++ * incrementoFila));

          // tslint:disable-next-line:max-line-length
          doc.text('Fecha Cancelación: ' + this.datePipe.transform(element2.fechaCancelacionCredito, 'dd/MM/yyyy'), col1, fila1 + (i++ * incrementoFila));
          // tslint:disable-next-line:max-line-length
          doc.text('Fecha Cancelación: ' + this.datePipe.transform(element2.fechaCancelacionCredito, 'dd/MM/yyyy'), col2Copia, fila1 + (icopia++ * incrementoFila));
        });

        i++; icopia++;
        doc.text('Fecha de Pago: .......................................', col1, fila1 + (i++ * incrementoFila));
        doc.text('Fecha de Pago: .......................................', col2Copia, fila1  * 1 + (icopia++ * incrementoFila));

        i++; icopia++;
        doc.text('Pagado: ..............................................', col1, fila1  + (i++ * incrementoFila));
        doc.text('Pagado: ..............................................', col2Copia, fila1 + (icopia++ * incrementoFila));

        i++; icopia++;
        doc.text('Firma Cobrador: ......................................', col1, fila1  + (i++ * incrementoFila));
        doc.text('Firma Cobrador: ......................................', col2Copia, fila1  + (icopia++ * incrementoFila));

        i++; icopia++;
        doc.setDrawColor(255,0,0); // draw red lines
        let filaSeparadora = fila1 + (i++ * incrementoFila);
        icopia++;
        // doc.line(separadorCol1, filaSeparadora, separadorCol2, filaSeparadora);
        // tslint:disable-next-line:max-line-length
        doc.text( '................................................................................................................................................................................................................................................................ ', separadorCol1, filaSeparadora);
      });
      doc.save('COBRANZAS-COBRADOR.pdf');
      let pdfImprimir = doc.output('blob'); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
      window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador
  }

  guardarAsignacionDeCobro(){
    this.cobranzaAsignadaACobrador.asignaciones = this.asignaciones;
    // console.log(this.cobranzaAsignadaACobrador);
    this.cuotasService.postGuardarCredito(this.cobranzaAsignadaACobrador).subscribe( resp => {
      let resultado = resp;
      // console.log(resultado);


      if (resp) {
        this.idAsignacionCobrazaGuardada = resp.idAsignacion;
        Swal({
          title: 'Se guardó correctamente la nomina de cobro',
          text: 'Quieres imprimirla?',
          type: 'success',
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Si, Imprimir!',
          cancelButtonText: 'No, Cancelar'
        }).then((result) => {
          if (result.value) {
            this.imprimirCuponesDePago();
          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        });

        this.buttonImprimirDisabled = false;
        this.buttonGuargarDisabled = true;

      }
    });
  }

  // lanzarPopupGuardar(id: string){  tenia un argumento pero el build tiro error, se saco el argumento
  lanzarPopupGuardar() {
    if (this.asignaciones.length > 0) {
      Swal({
        title: 'Estas seguro de guardar?',
        text: 'Al guardar, ya no podras agregar cobranzas al cobrador, deberas repetir todo el proceso',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this.guardarAsignacionDeCobro();
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

  onSearch(query: string = '') {

    if (query === '') {
      this.source = new LocalDataSource(this.characters);
    } else {
        this.source.setFilter([
          // fields we want to include in the search
          {
            field: 'dni',
            search: query
          },
          {
            field: 'apellidos',
            search: query
          },
          {
            field: 'domicilio.',
            search: query
          },
          {
            field: 'domicilio',
            search: query
          },
          {
            field: 'domicilio',
            search: query
          },

        ], false);
    }
  }





}
