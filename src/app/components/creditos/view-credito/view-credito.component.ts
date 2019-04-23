import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';
import { Session } from '../../../modelo/util/session';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { ActivatedRoute } from '@angular/router';
import { ReferenciaCliente } from '../form-credito/modelos/ReferenciaCliente';
import { ReferenciaComercio } from '../form-credito/modelos/RefereciaComercio';
import { DocumentoPresentado } from '../form-credito/modelos/DocumentoPresentado';
import { TablePlanCuotas } from '../form-credito/modelos/TablePlanCuotas';
import { CreditoNuevo } from '../form-credito/modelos/CreditoNuevo';
import { PlanPago } from '../../../modelo/negocio/planPago';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { FormClienteComponent } from '../../clientes/form-cliente/form-cliente.component';
import { ModalComercioComponent } from '../modal-comercio/modal-comercio.component';
import { DatePipe } from '@angular/common';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';
import { TableCreditos } from '../crud-creditos/TableCreditos';
import { NewSession } from '../../../modelo/util/newSession';
import * as moment from 'moment/moment';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-credito',
  templateUrl: './view-credito.component.html',
  styleUrls: ['./view-credito.component.css']
})
export class ViewCreditoComponent implements OnInit {

  // -------------------------
  @ViewChild(FormClienteComponent) hijo: FormClienteComponent;
  @ViewChild(ModalComercioComponent) hijoComercio: ModalComercioComponent;
  //@Output() emitEvent:EventEmitter<boolean> = new EventEmitter<boolean>();
  // --------------------------
  character: TableCreditos;
  creditoForm: FormGroup;
  session = new Session();
  newSession = new NewSession();

  planPago = {
    montoSolicitado: '',
    cobranzaEnDomicilio: false,
    cantidadCuotas: 0,
    tasa: 0,
    diasASumar: 0
  };

  id: string;
  idDni: string;

  evento: string;
  habilitarControles: boolean;
  usuario: any;

  creditoNuevo: CreditoNuevo = new CreditoNuevo;

  currentJustify = 'justified';
  tiposPlanes: any[];
  tiposReferencias: any[];
  planes: any[];
  referenciaComercios = [];
  referenciaTitulares = [];
  referenciaTitularesElegidos = [];
  referenciaComerciosElegidos = [];
  calificacionReferencia: string;
  calificacionReferenciaComercio: string;

  controls = [];

  cliente: any;
  comercio: any;
  garante: any;

  referenciaCliente: ReferenciaCliente;
  referenciaComercio: ReferenciaComercio;

  switchClienteGarante: string;


  // documentos que presenta el titular del credito
  documentosAPresentar: DocumentoPresentado[];
  documentosSolicitados: DocumentoPresentado[];
  // tipo de plan elegido, mensual, quincenal, semanal, tarjeta
  tipoPlanElegido: any;
  // plan elegido, cuotas segun el tipo del plan, cuotas de 6, 12, 16 pagos
  planElegido: any;

  characters = []; // contendra la informacion de cuotas

  thisCreditos: TableCreditos[];
  //creditos : TableCreditos;
  creditos: any;

  promedioDiasDeRetraso: any;
  porcentajeDeCumplimiento: any;
  cuotasRetrasadas: any;
  totalDiasRetraso: any;

  estadoCredito: string;
  noPermitidoGuardar = true;
  cambiarEstadoCredito = true;
  cierreCredito = true;

  settings = {

    actions: {
      columnTitle: '',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',
      custom: [],
    },
    columns: {
      orden: {
        title: 'Ord.',
        width: '5%',
        filter: false,
      },
      montoCapital: {
        title: 'Capital',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoCapital' ? value : Intl.NumberFormat('es-AR', {style: 'currency', currency: 'ARS'}).format(value);
        }
      },
      fechaVencimiento: {
        title: 'Vencimiento',
        width: '15%',
        filter: false,
        valuePrepareFunction: (cell, row) => { return moment(row.fechaVencimiento).format('DD-MM-YYYY') }
      },

      montoInteres: {
        title: 'Interes',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoInteres' ? value : Intl.NumberFormat('es-AR', {style: 'currency', currency: 'ARS'}).format(value);
        }
      },
      montoCobranzaADomicilio: {
        title: 'Adic. cobro Domic.',
        width: '20%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoCobranzaADomicilio' ? value : Intl.NumberFormat('es-AR', {style: 'currency', currency: 'ARS'}).format(value);
        }
      },
      MontoTotalCuota: {
        title: 'Total Cuota',
        width: '30%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'MontoTotalCuota' ? value : Intl.NumberFormat('es-AR', {style: 'currency', currency: 'ARS'}).format(value);
        }
      },
      cuotaPagada: {
        title: 'Pagado',
        width: '10%',
        filter: false,
        valuePrepareFunction: (value) => {
          return (value === true) ? 'Si' : 'No';
        }
      },
      diasRetraso: {
        title: 'Retraso',
        width: '5%',
        filter: false,
      },
    },
    pager: {
      display: true,
      perPage: 8
    },
  };


  constructor(private router: ActivatedRoute,
    private router2: Router,
    private fb: FormBuilder,
    private creditosService: CreditosService,
    private usuariosService: UsuariosService,
    private loginService: LoginService,
    private clientesService: ClientesService,
    private utilidadesService: UtilidadesService,
    private datePipe: DatePipe,
    public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    // agregar  consulta de credito por id para leer los datos de la ultima pestaña, referencia de titular y comercio


    this.creditos =  this.creditosService.Storage;
    this.estadoCredito = this.creditos.estado.nombre;

    console.log('Var STORAGE: ', this.creditosService.Storage);
    this.characters = this.creditos.planPagos.cuotas;

    this.calculosEstadisticos(this.characters);

    this.session = this.loginService.getDatosDeSession();

    this.router.params.subscribe(params => {
      this.idDni = params['id'];
      this.evento = params['evento'];
      if (this.evento === 'view') { // si es view carga controles deshabilitados, si es edit, habilitados
        this.habilitarControles = false;
      } else {
        this.habilitarControles = true;
      }
    });
    this.cargarformControls();
    this.cargarFormConDatos();
  }

  guardarAnalisis() {

    let analisis = [
      {
        item: 'Informe Veraz',
        comentario: this.notaVeraz.value,
        resultado: true
      },
      {
        item: 'Informe BCRA',
        comentario: this.notaBcra.value,
        resultado: true
      },
      {
        item: 'Resultado Final',
        comentario: this.notaResultadoFinal.value,
        resultado: true
      }
    ];
    this.creditosService.postAgregarAnalisisCrediticio(this.session, analisis, this.creditos._id).subscribe( result => {
        swal('Perfecto', 'Se guardaron tus notas de Análisis Crediticio', 'success');

        // tslint:disable-next-line:max-line-length
        if (this.creditos.estado.nombre === 'PENDIENTE DE REVISION' && (this.session.rolNombre === 'ADMINISTRADOR' || this.session.rolNombre === 'ROOT')) {
          this.cambiarEstadoCredito = false;
          this.cierreCredito = false;
          this.noPermitidoGuardar = true;
        }

    }, err => {
        swal('No se puso guardar las notas del analisis del credito', 'Intente nuevamente mas tarde', 'error');
    });



  }

  aprobarCredito(nuevoEstado : string) {
    // let nuevoEstado = 'APROBADO';
    let idNuevoEstado: string;

    console.log(this.creditos);

    this.clientesService.postGetCombos().subscribe(result => {
      let estados = result["respuesta"].estadosCredito;

      estados.forEach(element => {
        if (nuevoEstado === element.nombre) {
          idNuevoEstado = element._id;
        }
      });
      // tslint:disable-next-line:max-line-length
      if (this.creditos.estado.nombre === "PENDIENTE DE REVISION" || this.creditos.estado.nombre === "PENDIENTE DE APROBACION" ) {
          let nuevoCredito = {
            idCredito: this.creditos._id,
            estado: idNuevoEstado, // '5b72b281708d0830d07f3562'        // element.estado._id
            nombre_nuevo_estado: nuevoEstado, // APROBADO RECHASADO OTRO,
            cliente: this.creditos.cliente._id,
            monto: this.creditos.montoPedido,
            nombre_estado_actual: this.creditos.estado.nombre,
            token: this.session.token
          };
          console.log(nuevoCredito);
          this.estadoCredito = nuevoEstado;


          this.creditosService.postCambiarEstadoCredito(nuevoCredito).subscribe(result => {
               swal('Perfecto', 'Se actualizó el estado de Credito y se guardó las notas de Análisis Crediticio', 'success');
          }, err => {
               swal('No se puso cambiar el estado del credito', 'Intente nuevamente mas tarde', 'error');
          });
      } else {
          if (this.creditos.estado.nombre === "APROBADO"){
            swal('El credito ya está aprobado', 'No es posible volver a repetir la operación', 'error');
          } else {
            swal('No se pudo cambiar el estado del credito', 'Solo los creditos pendientes de aprobacion pueden ser aprobados', 'error');
          }
      }
    });
  }




  calculosEstadisticos(cuotas: any) {


    let totalCuotas = cuotas.length;
    let cuotasPagadas = 0;
    this.cuotasRetrasadas = 0;
    this.totalDiasRetraso = 0;

    cuotas.forEach(element => {
      if (element.cuotaPagada) {
        cuotasPagadas = cuotasPagadas + 1;
      }
      if (element.diasRetraso > 0) {
        this.cuotasRetrasadas = this.cuotasRetrasadas + 1;
        this.totalDiasRetraso =  this.totalDiasRetraso + element.diasRetraso;
      }
    });

    this.promedioDiasDeRetraso = this.totalDiasRetraso / this.cuotasRetrasadas;
    this.porcentajeDeCumplimiento = (cuotasPagadas / totalCuotas);



  }
  cerrarCredito() {
    swal({
      title: 'Estas a punto de cerrar el credito!! ',
      text: "Esta operacion es Irreversible!, Al cerrar el credito no podrá cobrar ninguna cuota de este credito, estas seguro?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cerrar Credito!'
    }).then(async (result) => {
      if (result.value) {
        const {value: text} = await swal({
          input: 'textarea',
          inputPlaceholder: 'Ingrese un comentario sobre el motivo del cierre del credito...',
          showCancelButton: true
        });
        if (text) {

          this.creditosService.postCerrarCredito(this.session, this.creditos._id, text).subscribe (result => {
            if (result) {
              swal(
                'Credito Cerrado!',
                'El credito fue cerrado.',
                'success'
              );
              this.router2.navigate(['crudcreditosadmintodos']);
            }
          }, err => {
            if (err.status === 401 || err.status === 403) {
              swal('Usuario no autorizado', 'Comuniquele al administrador para cerrar el credito, solo él puede hacer esta operación', 'error');
            } else {

           /*    console.log(err.status);
              console.log(err); */
              swal(
                'No se pudo cerrar el credito!',
                'Hubo un error, intente mas tarde',
                'error'
              );
            }






          });

        } else {
          swal(
            'El Credito no fue cerrado',
            'Intente nuevamente, pero debe agregar un comentario del cierre del credito',
            'info'
          );
        }
      }
    });

  }

  onFormSubmit() {
  }

  get dni() { return this.creditoForm.get('dni'); }
  get apellidos() { return this.creditoForm.get('apellidos'); }
  get nombres() { return this.creditoForm.get('nombres'); }
  get fechaNacimiento() { return this.creditoForm.get('fechaNacimiento'); }
  get montoSolicitado() { return this.creditoForm.get('montoSolicitado'); }
  get tipoDePlan() { return this.creditoForm.get('tipoDePlan'); }
  get plan() { return this.creditoForm.get('plan'); }
  get cobroDomicilio() { return this.creditoForm.get('cobroDomicilio'); }
  get dniGarante() { return this.creditoForm.get('dniGarante'); }
  get apellidosGarante() { return this.creditoForm.get('apellidosGarante'); }
  get nombresGarante() { return this.creditoForm.get('nombresGarante'); }
  get fechaNacimientoGarante() { return this.creditoForm.get('fechaNacimientoGarante'); }
  get cuit() { return this.creditoForm.get('cuit'); }
  get razonSocial() { return this.creditoForm.get('razonSocial'); }


  get numeroLegajo() { return this.creditoForm.get('numeroLegajo'); }
  get prefijoLegajo() { return this.creditoForm.get('prefijoLegajo'); }
  get tipoReferenciaTitular() { return this.creditoForm.get('tipoReferenciaTitular'); }
  get itemsReferenciasTitular() { return this.creditoForm.get('itemsReferenciasTitular'); }
  get notaComentarioTitular() { return this.creditoForm.get('notaComentarioTitular'); }
  get tipoReferenciaComercio() { return this.creditoForm.get('tipoReferenciaComercio'); }
  get itemsReferenciasComercio() { return this.creditoForm.get('itemsReferenciasComercio'); }
  get notaComentarioComercio() { return this.creditoForm.get('notaComentarioComercio'); }

  get notaVeraz() { return this.creditoForm.get('notaVeraz'); }
  get notaBcra() { return this.creditoForm.get('notaBcra'); }
  get notaResultadoFinal() { return this.creditoForm.get('notaResultadoFinal'); }


  cargarformControls() {

        this.creditoForm = this.fb.group({
          dni: new FormControl('', [Validators.required]),
          apellidos: new FormControl('', [Validators.required]),
          nombres: new FormControl('', [Validators.required]),
          fechaNacimiento: new FormControl('', [Validators.required]),
          montoSolicitado: new FormControl('', [Validators.required]),
          tipoDePlan: new FormControl('', [Validators.required]),
          plan: new FormControl('', [Validators.required]),
          cobroDomicilio: new FormControl(false),

          dniGarante: new FormControl('', [Validators.required]),
          apellidosGarante: new FormControl('', [Validators.required]),
          nombresGarante: new FormControl('', [Validators.required]),
          fechaNacimientoGarante: new FormControl('', [Validators.required]),
          cuit: new FormControl(''),
          razonSocial: new FormControl(''),

          // array de checkbox dinamico
          documentaciones: new FormArray(this.controls),
          tipoReferenciaTitular: new FormControl('', [Validators.required]),
          itemsReferenciasTitular: new FormArray(this.controls),
          notaComentarioTitular: new FormControl(''),

          tipoReferenciaComercio: new FormControl('', [Validators.required]),
          itemsReferenciasComercio: new FormArray(this.controls),
          notaComentarioComercio: new FormControl(''),
          numeroLegajo: new FormControl('', [Validators.required]),
          prefijoLegajo: new FormControl(''),

          notaVeraz: new FormControl(''),
          notaBcra:  new FormControl(''),
          notaResultadoFinal:  new FormControl(''),
      });



    if (!this.habilitarControles) {

      this.dni.disable();
      this.apellidos.disable();
      this.nombres.disable();
      this.fechaNacimiento.disable();

      this.montoSolicitado.disable();
      this.tipoDePlan.disable();
      this.plan.disable();
      this.cobroDomicilio.disable();

      this.dniGarante.disable();
      this.apellidosGarante.disable();



      this.nombresGarante.disable();
      this.fechaNacimientoGarante.disable();
      this.cuit.disable();
      this.razonSocial.disable();

      this.numeroLegajo.disable();
      this.prefijoLegajo.disable();
      this.tipoReferenciaTitular.disable();
      this.itemsReferenciasTitular.disable();
      this.notaComentarioTitular.disable();
      this.notaComentarioComercio.disable();


    }
  }

  historialCliente(){



  }
  cargarFormConDatos(){

    this.dni.setValue(this.creditos.cliente.titular.dni);
    this.apellidos.setValue(this.creditos.cliente.titular.apellidos);
    this.nombres.setValue(this.creditos.cliente.titular.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(this.creditos.cliente.titular.fechaNacimiento));

    this.montoSolicitado.setValue( this.creditos.montoPedido);

    this.tipoDePlan.setValue(this.creditos.planPagos.tipoPlan.nombre);
    this.plan.setValue(this.creditos.planPagos.CantidadCuotas);

    // tslint:disable-next-line:max-line-length
    if ((this.creditos.hasOwnProperty('comercio') && this.creditos.comercio != null)) {
      this.cuit.setValue(this.creditos.comercio.cuit);
      this.razonSocial.setValue(this.creditos.comercio.razonSocial);
      this.tiposReferencias = this.creditos.comercio.referencias;

      let arrayComercios = this.creditos.comercio.referencias;
      this.referenciaComercios = arrayComercios[arrayComercios.length - 1].itemsReferencia;
      this.calificacionReferenciaComercio = arrayComercios[arrayComercios.length - 1].tipoReferencia.nombre;
      this.notaComentarioComercio.setValue(arrayComercios[arrayComercios.length - 1].comentario);

    } else {
      this.cuit.setValue('');
      this.razonSocial.setValue('');
      this.tiposReferencias = [];
    }

    if ((this.creditos.hasOwnProperty('garante') && this.creditos.garante != null)) {
      this.dniGarante.setValue(this.creditos.garante.titular.dni);
      this.apellidosGarante.setValue(this.creditos.garante.titular.apellidos);
      this.nombresGarante.setValue(this.creditos.garante.titular.nombres);
      this.fechaNacimientoGarante.setValue(this.utilidadesService.formateaDateAAAAMMDD(this.creditos.garante.titular.fechaNacimiento));
    } else {
      this.dniGarante.setValue(0);
      this.apellidosGarante.setValue('');
      this.nombresGarante.setValue('');
      this.fechaNacimientoGarante.setValue('');
    }



    this.cobroDomicilio.setValue(this.creditos.tieneCobranzaADomicilio);
    this.numeroLegajo.setValue(this.creditos.legajo);
    this.prefijoLegajo.setValue(this.creditos.legajo_prefijo);

    this.documentosAPresentar = this.creditos.documentos;


    let arrayClientes = this.creditos.cliente.referencias;
    this.referenciaTitulares = arrayClientes[arrayClientes.length - 1].itemsReferencia;
    this.calificacionReferencia = arrayClientes[arrayClientes.length - 1].tipoReferencia.nombre;
    this.notaComentarioTitular.setValue(arrayClientes[arrayClientes.length - 1].comentario);

    // Carga de Analisis Crediticio
    if (this.creditos.analisisCredito.length > 0) {
      this.creditos.analisisCredito.forEach(element => {
        if (element.item === 'Informe Veraz') {
          this.notaVeraz.setValue(element.comentario);
        }
        if (element.item === 'Informe BCRA') {
          this.notaBcra.setValue(element.comentario);
        }
        if (element.item === 'Resultado Final') {
          this.notaResultadoFinal.setValue(element.comentario);
        }
      });

      // tslint:disable-next-line:max-line-length
      if (this.creditos.estado.nombre === 'PENDIENTE DE REVISION' && (this.session.rolNombre === 'ADMINISTRADOR' || this.session.rolNombre === 'ROOT')) {
        this.cambiarEstadoCredito = false;
        this.cierreCredito = false;
      }


    } else {
      if (this.session.rolNombre === 'ADMINISTRADOR' || this.session.rolNombre === 'ROOT') {
        this.noPermitidoGuardar = false;
      }

    }




  }

  changeCheckboxDocumentacion(i) {
    if (this.documentosAPresentar) {
      this.documentosAPresentar[i].requerido = !this.documentosAPresentar[i].requerido;
    }
  }

  changeCheckboxReferenciaTitular(i) {
  }

  changeCheckboxReferenciaComercio(i) {
  }

  calcularPlanDePago() {
  }


  getReferenciaCliente(){

  }
  showComercio($event){

  }
  showCliente($event){

  }

}
