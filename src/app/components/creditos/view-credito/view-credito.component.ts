import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-view-credito',
  templateUrl: './view-credito.component.html',
  styleUrls: ['./view-credito.component.css']
})
export class ViewCreditoComponent implements OnInit {

  // -------------------------
  @ViewChild(FormClienteComponent) hijo: FormClienteComponent;
  @ViewChild(ModalComercioComponent) hijoComercio: ModalComercioComponent;
  // --------------------------

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

  creditoReferencias: any; // cnotiene el credito que tiene las referencias del titular y del credito para mosgtrar

  // documentos que presenta el titular del credito
  documentosAPresentar: DocumentoPresentado[];
  documentosSolicitados: DocumentoPresentado[];
  // tipo de plan elegido, mensual, quincenal, semanal, tarjeta
  tipoPlanElegido: any;
  // plan elegido, cuotas segun el tipo del plan, cuotas de 6, 12, 16 pagos
  planElegido: any;

  characters = []; // contendra la informacion de cuotas

  thisCreditos: TableCreditos[];
  creditos : TableCreditos;

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
      vencimiento: {
        title: 'Vencimiento',
        width: '15%',
        filter: false,
        valuePrepareFunction: (cell, row) => { return moment(row.vencimiento).format('DD-MM-YYYY') }
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
      }
    },
    pager: {
      display: true,
      perPage: 8
    },
  };


  constructor(private router: ActivatedRoute,
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
    console.log('Var STORAGE: ', this.creditosService.Storage);
    this.characters = this.creditos.planPagos.cuotas;

    this.session.token = this.loginService.getTokenDeSession();
    this.creditosService.postGetCreditoPorId(this.creditos._id, this.session.token).subscribe( result => {
          this.creditoReferencias = result['credito'][0];


          // Vañidar cantidad de referencias de titulares y comercios
          let arrayClientes = this.creditoReferencias.cliente.referencias;
          // this.referenciaTitulares = this.creditoReferencias.cliente.referencias.pop().itemsReferencia;
          this.referenciaTitulares = arrayClientes[arrayClientes.length - 1].itemsReferencia;
          this.calificacionReferencia = this.creditoReferencias.cliente.referencias.pop().tipoReferencia.nombre;
          this.notaComentarioTitular.setValue(this.creditoReferencias.cliente.referencias.pop().comentario);

          let array = this.creditoReferencias.comercio.referencias;
          this.referenciaComercios = array[array.length - 1].itemsReferencia;
          this.calificacionReferenciaComercio = array[array.length - 1].tipoReferencia.nombre;
          this.notaComentarioComercio.setValue(array[array.length - 1].comentario);
    });

    this.router.params.subscribe(params => {
      this.idDni = params['id'];
      //creditos = params['character'];
      //console.log(this.idDni);
      this.evento = params['evento'];
      /* console.log(this.evento); */
      if (this.evento === 'view') { // si es view carga controles deshabilitados, si es edit, habilitados
        this.habilitarControles = false;
      } else {
        this.habilitarControles = true;
      }
    });
    this.cargarformControls();
    this.cargarFormConDatos();



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
          notaComentarioTitular: new FormControl('', [Validators.required]),

          tipoReferenciaComercio: new FormControl('', [Validators.required]),
          itemsReferenciasComercio: new FormArray(this.controls),
          notaComentarioComercio: new FormControl(''),
          numeroLegajo: new FormControl('', [Validators.required]),
          prefijoLegajo: new FormControl(''),


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

  cargarFormConDatos(){

    this.dni.setValue(this.creditos.cliente.titular.dni);
    this.apellidos.setValue(this.creditos.cliente.titular.apellidos);
    this.nombres.setValue(this.creditos.cliente.titular.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(this.creditos.cliente.titular.fechaNacimiento));

    this.montoSolicitado.setValue( this.creditos.montoPedido);

    this.tipoDePlan.setValue(this.creditos.planPagos.tipoPlan.nombre);
    this.plan.setValue(this.creditos.planPagos.CantidadCuotas);


    this.dniGarante.setValue(this.creditos.garante.titular.dni);
    this.apellidosGarante.setValue(this.creditos.garante.titular.apellidos);
    this.nombresGarante.setValue(this.creditos.garante.titular.nombres);
    this.fechaNacimientoGarante.setValue(this.utilidadesService.formateaDateAAAAMMDD(this.creditos.garante.titular.fechaNacimiento));
    this.cuit.setValue(this.creditos.comercio.cuit);
    this.razonSocial.setValue(this.creditos.comercio.razonSocial);
    this.cobroDomicilio.setValue(this.creditos.tieneCobranzaADomicilio);


    this.numeroLegajo.setValue(this.creditos.legajo);
    this.prefijoLegajo.setValue(this.creditos.legajo_prefijo);


    this.documentosAPresentar = this.creditos.documentos;
    this.tiposReferencias = this.creditos.comercio.referencias;
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
}
