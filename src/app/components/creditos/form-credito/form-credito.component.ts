import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { Session } from '../../../modelo/util/session';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';
import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';
import { TablePlanCuotas } from './modelos/TablePlanCuotas';
import { formatNumber } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CreditoNuevo } from './modelos/CreditoNuevo';
import { DocumentoPresentado } from './modelos/DocumentoPresentado';


@Component({
  selector: 'app-form-credito',
  templateUrl: './form-credito.component.html'
})
export class FormCreditoComponent implements OnInit {
  creditoNuevo: CreditoNuevo = new CreditoNuevo;
  session: Session;
  creditoForm: FormGroup;
  currentJustify = 'justified';
  tiposPlanes: any[];
  tiposReferencias: any[];
  planes: any[];
  referenciaComercios = [];
  referenciaTitulares = [];
  controls = [];
  cliente: any;
  comercio: any;
  garante: any;

  // documentos que presenta el titular del credito
  documentosAPresentar: DocumentoPresentado[];
  documentosSolicitados: DocumentoPresentado[];
  // tipo de plan elegido, mensual, quincenal, semanal, tarjeta
  tipoPlanElegido: any;
  // plan elegido, cuotas segun el tipo del plan, cuotas de 6, 12, 16 pagos
  planElegido: any;

  characters: TablePlanCuotas[];

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
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
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


  planPago = {
    montoSolicitado: '',
    cobranzaEnDomicilio: false,
    cantidadCuotas: 0,
    tasa: 0,
    diasASumar: 0
  };


  constructor(
      private fb: FormBuilder,
      private clientesService: ClientesService,
      private loginService: LoginService,
      private utilidadesService: UtilidadesService,
      private creditosService: CreditosService,
      private datePipe: DatePipe ) { }

  ngOnInit() {
    this.session = new Session();
    this.session.token = this.loginService.getTokenDeSession();
    this.cargarControlesForm();


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
      numeroLegajo:  new FormControl('', [Validators.required]),
      tipoReferenciaTitular: new FormControl('', [Validators.required]),
      itemsReferenciasTitular: new FormArray(this.controls),
      notaComentarioTitular: new FormControl('', [Validators.required]),

      tipoReferenciaComercio: new FormControl('', [Validators.required]),
      itemsReferenciasGarante: new FormArray(this.controls),
      notaComentarioComercio: new FormControl(''),


    });
  }
  get dni() {    return this.creditoForm.get('dni');  }
  get apellidos() {    return this.creditoForm.get('apellidos');  }
  get nombres() {    return this.creditoForm.get('nombres');  }
  get fechaNacimiento() {    return this.creditoForm.get('fechaNacimiento');  }
  get montoSolicitado() {    return this.creditoForm.get('montoSolicitado');  }
  get tipoDePlan() {    return this.creditoForm.get('tipoDePlan');  }
  get plan() {    return this.creditoForm.get('plan');  }
  get cobroDomicilio() {    return this.creditoForm.get('cobroDomicilio');  }
  get dniGarante() {    return this.creditoForm.get('dniGarante');  }
  get apellidosGarante() {    return this.creditoForm.get('apellidosGarante');  }
  get nombresGarante() {    return this.creditoForm.get('nombresGarante');  }
  get fechaNacimientoGarante() {    return this.creditoForm.get('fechaNacimientoGarante');  }
  get cuit() {    return this.creditoForm.get('cuit');  }
  get razonSocial() {    return this.creditoForm.get('razonSocial');  }


  /* get documentacion() {    return this.creditoForm.get('documentacion');  } */
  get numeroLegajo() {    return this.creditoForm.get('numeroLegajo');  }
  get tipoReferenciaTitular() {    return this.creditoForm.get('tipoReferenciaTitular');  }
  get itemsReferenciasTitular() {    return this.creditoForm.get('itemsReferenciasTitular');  }
  get notaComentarioTitular() {    return this.creditoForm.get('notaComentarioTitular');  }
  get tipoReferenciaComercio() {    return this.creditoForm.get('tipoReferenciaGarante');  }
  get itemsReferenciasGarante() {    return this.creditoForm.get('itemsReferenciasGarante');  }
  get notaComentarioComercio() {    return this.creditoForm.get('notaComentarioGarante');  }







  onFormSubmit() {
     this.guardarCredito();
  }

  guardarCredito() {
    this.creditoNuevo.montoSolicitado = this.montoSolicitado.value;
    this.creditoNuevo.cobranzaEnDomicilio = this.cobroDomicilio.value;

    this.creditoNuevo.tasa = this.planPago.tasa;
    this.creditoNuevo.cantidadCuotas = this.planPago.cantidadCuotas;
    this.creditoNuevo.diasASumar = this.planPago.diasASumar;
    this.creditoNuevo.token = this.session.token;

    this.creditoNuevo.cliente = this.cliente._id;
    this.creditoNuevo.garante = this.garante._id;
    this.creditoNuevo.comercio = this.comercio._id;

    let documentosAGuardar = [];
    // Carga el array de  documentos a presentar
    for (let i = 0; i < this.documentosSolicitados.length; i++) {
      let documento = new DocumentoPresentado();
      documento.nombre = this.documentosSolicitados[i].nombre;
      documento.requerido = this.documentosSolicitados[i].requerido;
      // el requerido de docAPresentar es porq tiene almacenado el valor actual de seleccion del checkbox
      documento.presentado = this.documentosAPresentar[i].requerido;
      documentosAGuardar.push(documento);
    }
    this.creditoNuevo.documentos = documentosAGuardar;
    this.creditoNuevo.legajo = this.numeroLegajo.value;
    // console.log('Item de docs a a PARA PRESENTAR', this.documentosAPresentar);
    // console.log('Item de docs a ORIGINAL', this.documentosSolicitados);
    // console.log('SE MANDA A GUARDAR: ', documentosAGuardar);
    console.log(this.creditoNuevo);
    this.creditosService.postGuardarCredito(this.creditoNuevo).subscribe(result => {
        let respuesta = result;
        console.log(respuesta);
    });

  }


  verClientes() {
    this.clientesService.postGetClientes(this.session).subscribe( response => {
        let clientes = response['clientes'];
    });
  }
  buscarClientePorDni() {
    let dni = this.dni.value;
    this.clientesService.postGetClientePorDni(this.session, dni).subscribe( response => {
        this.cliente = response['clientes'][0];
        this.cargarClienteForm(this.cliente);
    });
  }
  cargarClienteForm(cliente: any) {
    this.apellidos.setValue(cliente.titular.apellidos);
    this.nombres.setValue(cliente.titular.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(cliente.titular.fechaNacimiento));
  }


  cargarControlesForm() {
    this.clientesService.postGetCombos().subscribe( response => {
      let combos = response['respuesta'];

      // Carga de compos de Tipos de Planes
      this.tiposPlanes = response['respuesta'].tiposPlanes;
      // Tipo de Referencia: Buena - Mala - Regular
      this.tiposReferencias = response['respuesta'].tiposReferencias;
      // Carga de combos de referencias
      let referencias = response['respuesta'].itemsReferencia;
      for (let ref of referencias) {
        if (ref.referenciaCliente) {
          this.referenciaTitulares.push(ref);
        } else {
          this.referenciaComercios.push(ref);
        }
      }

      // Carga de Checkbox de Documentacion Presentada, cambia segun accion del usuario
      this.documentosAPresentar = <DocumentoPresentado[]>response['respuesta'].documentos;
      // Se copia el contenido en otro objeto para mantener la solicitud ORIGINAL del sistema inicial de documentacion
      this.documentosSolicitados = JSON.parse(JSON.stringify(this.documentosAPresentar));

    });

  }

  changeCheckboxDocumentacion(i) {
    if (this.documentosAPresentar) {
      this.documentosAPresentar[i].requerido = !this.documentosAPresentar[i].requerido;
    }
  }
  changeCheckboxReferenciaTitular(i){
    if (this.referenciaTitulares) {
      this.referenciaTitulares[i].referenciaCliente = !this.referenciaTitulares[i].referenciaCliente;
      let itemRTElegido = {
        item: this.referenciaTitulares[i].item,
        checkboxElegido: !this.referenciaTitulares[i].referenciaCliente,
      };
    }
  }

  changeCheckboxReferenciaComercio(i){
    this.referenciaComercios[i].referenciaCliente = !this.referenciaComercios[i].referenciaCliente;
    if (this.referenciaComercios) {
      let itemRTElegido = {
        item: this.referenciaComercios[i].item,
        checkboxElegido: this.referenciaComercios[i].referenciaCliente,
      };
    }
  }

  calcularPlanDePago() {

    this.planPago = {
      montoSolicitado: this.montoSolicitado.value,
      cobranzaEnDomicilio: this.cobroDomicilio.value,
      cantidadCuotas: this.plan.value,
      tasa: this.planElegido.tasa,
      diasASumar: this.tipoPlanElegido.diasASumar,
    };


      this.creditosService.postGetPlanDePago(this.planPago).subscribe( response => {
          let p = response['planPago'];
         // Asignacion para cargar la tabla de datos
         this.characters = p.planPagos;
      });

  }


  onChangeTipoPlanes() {
    this.tipoPlanElegido =  this.tiposPlanes.find(x => x.nombre === this.creditoForm.get('tipoDePlan').value);
    this.planes = this.tipoPlanElegido.plan;
  }

  onChangePlanes() {
    let planCuotaElegido = parseInt(this.creditoForm.get('plan').value, 10);
    this.planElegido =  this.planes.find(x => x.cantidadCuotas === planCuotaElegido);
  }

  buscarComercioPorCuit() {
    let cuit = this.cuit.value;
    this.clientesService.postGetComercioPorCuit(this.session, cuit).subscribe( response => {
        this.comercio = response['comercio'][0];
        this.cargarComercioForm(this.comercio);
    });
  }

  buscarGarantePorDni() {
    let dni = this.dniGarante.value;
    this.clientesService.postGetClientePorDni(this.session, dni).subscribe( response => {
        this.garante = response['clientes'][0];
        this.cargarGaranteForm(this.garante);
    });
  }

  cargarGaranteForm(garante: any) {
    this.apellidosGarante.setValue(garante.titular.apellidos);
    this.nombresGarante.setValue(garante.titular.nombres);
    this.fechaNacimientoGarante.setValue(this.utilidadesService.formateaDateAAAAMMDD(garante.titular.fechaNacimiento));
  }
  cargarComercioForm(comercio: any){
    this.razonSocial.setValue(comercio.razonSocial);
  }

}
