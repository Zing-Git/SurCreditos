import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { Session } from '../../../modelo/util/session';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';
import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';
import { TablePlanCuotas } from './modelos/TablePlanCuotas';

import { DatePipe } from '@angular/common';
import { CreditoNuevo } from './modelos/CreditoNuevo';
import { DocumentoPresentado } from './modelos/DocumentoPresentado';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';


// Importo el componente hijo CHILD
import { FormClienteComponent } from '../../clientes/form-cliente/form-cliente.component';
import { ReferenciaCliente } from './modelos/ReferenciaCliente';
import { ReferenciaComercio } from './modelos/RefereciaComercio';

import { ModalComercioComponent } from '../modal-comercio/modal-comercio.component';
import { Persona } from '../../../modelo/negocio/persona';
import { Router } from '@angular/router';




@Component({
  selector: 'app-form-credito',
  templateUrl: './form-credito.component.html'
})
export class FormCreditoComponent implements OnInit {

  // -------------------------
  @ViewChild(FormClienteComponent) hijo: FormClienteComponent;
  @ViewChild(ModalComercioComponent) hijoComercio: ModalComercioComponent;
  // --------------------------


  creditoNuevo: CreditoNuevo = new CreditoNuevo;
  session: Session;
  creditoForm: FormGroup;
  currentJustify = 'justified';
  calificacionComercio = 0;
  calificacionTitular = 0;

  tiposPlanes: any[];
  tiposReferencias: any[];
  planes: any[];
  referenciaComercios = [];
  referenciaTitulares = [];
  referenciaTitularesElegidos = [];
  referenciaComerciosElegidos = [];


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
      private router: Router,
      private fb: FormBuilder,
      private clientesService: ClientesService,
      private usuariosService: UsuariosService,
      private loginService: LoginService,
      private utilidadesService: UtilidadesService,
      private creditosService: CreditosService,
      private datePipe: DatePipe,
      public ngxSmartModalService: NgxSmartModalService) { }




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

      tipoReferenciaTitular: new FormControl('', [Validators.required]),
      itemsReferenciasTitular: new FormArray(this.controls),
      notaComentarioTitular: new FormControl('', [Validators.required]),

      tipoReferenciaComercio: new FormControl('', [Validators.required]),
      itemsReferenciasComercio: new FormArray(this.controls),
      notaComentarioComercio: new FormControl(''),
      prefijoLegajo: new FormControl(''),
      numeroLegajo:  new FormControl('', [Validators.required]),

    });

    // Inicializar controles:----------
    this.tipoReferenciaComercio.setValue('5b684e87e4958a3e0cbfddc0'); // calificacion mala
    this.tipoReferenciaComercio.disable();
    this.tipoReferenciaTitular.setValue('5b684e87e4958a3e0cbfddc0'); // calificacion mala
    // ----------------------------------


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

  get tipoReferenciaTitular() {    return this.creditoForm.get('tipoReferenciaTitular');  }
  get itemsReferenciasTitular() {    return this.creditoForm.get('itemsReferenciasTitular');  }
  get notaComentarioTitular() {    return this.creditoForm.get('notaComentarioTitular');  }
  get tipoReferenciaComercio() {    return this.creditoForm.get('tipoReferenciaComercio');  }
  get itemsReferenciasComercio() {    return this.creditoForm.get('itemsReferenciasComercio');  }
  get notaComentarioComercio() {    return this.creditoForm.get('notaComentarioComercio');  }
  get numeroLegajo() {    return this.creditoForm.get('numeroLegajo');  }
  get prefijoLegajo() {    return this.creditoForm.get('prefijoLegajo');  }


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
    this.creditoNuevo.legajo = this.numeroLegajo.value;
    this.creditoNuevo.documentos = this.getDocumentosPresentadosAGuardar();

    this.creditoNuevo.cliente = this.cliente._id;
    this.creditoNuevo.garante = this.garante._id;
    this.creditoNuevo.prefijoLegajo = this.prefijoLegajo.value;


    this.getReferenciaCliente();
    this.clientesService.postAgregarReferenciaCliente(this.referenciaCliente).subscribe( resultCliente => {

        if (this.comercio) {
          // Si existe comercio
          this.creditoNuevo.comercio = this.comercio._id;
          console.log('ID de Comercio: ', this.creditoNuevo.comercio);
          // Agregar Referencia a Comercio

          console.log('Referncia Comercio a GUARDAR: ', this.referenciaComercio);


          this.getReferenciaComercio();
          console.log('Referencia COmercio a GUARDAR: ', this.referenciaComercio);
          this.clientesService.postAgregarReferenciaComercio(this.referenciaComercio).subscribe( resultComercio => {
              // Alta de Credito
              console.log(resultComercio);
              this.creditosService.postGuardarCredito(this.creditoNuevo).subscribe(result => {
                  let respuesta = result;
                  alert('Bien hecho!, Credito generado con éxito');
                  this.router.navigate(['crudcreditos']);
                  console.log(respuesta);
              }, err => {
                  alert('Hubo un problema al registrar la solicitud de credito');
              });
          }, err => {
              alert('Ocurrio un error al asignar la referencia al comercio');
          });
        } else {
          // Si no Existe el  Comercio, dar el alta antes de guardar credito--------------------
          alert('Hubo un problema con el comercio, intente seleccionar un comercio correcto');
        }
    }, err => {
      alert('Hubo un problema al asignar una referencia al cliente');
    });
    console.log(this.creditoNuevo);
  }


  getComercioAGuardar(): any {
    let comercioAGuardar = {
      token: this.session.token,
      idComercio: 0,
      cuit: this.cuit.value,
      razonSocial: this.razonSocial.value,
      // referencia:
      idCliente: this.cliente._id,
    };
    return comercioAGuardar;
  }

  getItemsReferenciasCliente(): any[] {
    // Agrega Referencias al Titular  y Comercio ---------------------
    let itemsReferenciaCliente = [];
    this.referenciaTitularesElegidos.forEach(element => {
      if (element.referenciaCliente) {
        let valorItem: Object = {
          item: element._id
        };
        itemsReferenciaCliente.push(valorItem);
      }
    });
    console.log('Items Cliente: ', itemsReferenciaCliente);
    return itemsReferenciaCliente;
  }

  getItemsReferenciasComercio(): any[] {
    let itemsReferenciaComercio = [];

    console.log(this.referenciaComerciosElegidos);

    this.referenciaComerciosElegidos.forEach(element => {
      if (element.referenciaCliente) {
        let valorItem: Object = {
          item: element._id,
          peso: element.peso
        };
        itemsReferenciaComercio.push(valorItem);
      }
    });
    console.log('Items Comercios: ', itemsReferenciaComercio);
    return itemsReferenciaComercio;
  }

  getReferenciaCliente() {
    console.log('id de Clienteeee: ', this.cliente._id);
    this.referenciaCliente = {
      token: this.session.token,
      cliente: {
        _id: this.cliente._id,
        referencia: {
          _id: '0',
          tipoReferencia: this.tipoReferenciaTitular.value,
          comentario: this.notaComentarioTitular.value,
          itemsReferencia: this.getItemsReferenciasCliente()
        }
      }
    };
    console.log(this.referenciaCliente);
  }

  getReferenciaComercio() {
    console.log('id de Comercio: ', this.comercio._id);
    this.referenciaComercio = {
      token: this.session.token,
      comercio: {
        id: this.comercio._id,
        referencia: {
          _id: '0',
          tipoReferencia: this.tipoReferenciaComercio.value,
          comentario: this.notaComentarioComercio.value,
          itemsReferencia: this.getItemsReferenciasComercio()
        }
      }
    };
    console.log(this.referenciaComercio);
  }




  getDocumentosPresentadosAGuardar(): any[] {
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
    return documentosAGuardar;
  }

  verClientes() {
    this.clientesService.postGetClientes(this.session).subscribe( response => {
        let clientes = response['clientes'];
    });
  }
  buscarClientePorDni() {
    let dni = this.dni.value;
    let tipoDeAlta: string;
    let persona: any;
    this.switchClienteGarante = 'CLIENTE';

    // 1: si dni no es vacio
    if ( this.dni.value !== '') {
      // 2: Si el Cliente existe:
      this.clientesService.postGetClientePorDni(this.session, dni).subscribe( response => {
            this.cliente = response['clientes'][0];
            this.cargarClienteForm(this.cliente);
            console.log('cliente._id: ', this.cliente._id);
      }, err => {
            // 3: Si no existe el cliente, puede ser una persona, entonces llenar datos de persona
            this.usuariosService.postGetPersona(this.session.token, this.dni.value).subscribe(response => {
              persona = response['personaDB'][0];
              tipoDeAlta = 'ExistePersona';
              this.hijo.recibePametros(persona, tipoDeAlta);
              this.ngxSmartModalService.getModal('clienteModal').open();
            }, err => {
              // 4: Si no es persona, entonces hay que darle de alta con ID Persona 0
              let resp = confirm('Cliente Inexistente, quiere darle de Alta?');
              if (resp) {
                tipoDeAlta = 'NoExistePersona';
                persona = {
                  dni: this.dni.value,
                };
                this.hijo.recibePametros(persona, tipoDeAlta);
                this.ngxSmartModalService.getModal('clienteModal').open();
              }
            });
      });
    } else {
      alert('Debe ingresare un número de Dni');
    }

  }
  cargarClienteForm(cliente: any) {
    this.apellidos.setValue(cliente.titular.apellidos);
    this.nombres.setValue(cliente.titular.nombres);

    if (cliente.titular.fechaNacimiento !== null) {
      this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(cliente.titular.fechaNacimiento));
    }
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
        if (ref.referenciaCliente) { // si la "referenciaCliente": true es de un Titular
          this.referenciaTitulares.push(ref);
        } else {                     // si la "referenciaCliente": false es de un comercio
          this.referenciaComercios.push(ref);
        }
      }

      // Carga de Checkbox de Documentacion Presentada, cambia segun accion del usuario
      this.documentosAPresentar = <DocumentoPresentado[]>response['respuesta'].documentos;
      // Se copia el contenido en otro objeto para mantener la solicitud ORIGINAL del sistema inicial de documentacion
      this.documentosSolicitados = JSON.parse(JSON.stringify(this.documentosAPresentar));

     this.referenciaTitularesElegidos = JSON.parse(JSON.stringify(this.referenciaTitulares));
     this.referenciaComerciosElegidos = JSON.parse(JSON.stringify(this.referenciaComercios));


    });

  }

  changeCheckboxDocumentacion(i) {
    if (this.documentosAPresentar) {
      this.documentosAPresentar[i].requerido = !this.documentosAPresentar[i].requerido;
    }
  }

  changeCheckboxReferenciaTitular(i) {
    if (this.referenciaTitulares) {
      this.referenciaTitulares[i].referenciaCliente = !this.referenciaTitulares[i].referenciaCliente;
      let itemRTElegido = {
        item: this.referenciaTitulares[i].item,
        checkboxElegido: !this.referenciaTitulares[i].referenciaCliente,
      };

      this.referenciaTitularesElegidos[i].referenciaCliente = !this.referenciaTitulares[i].referenciaCliente;
      console.log(itemRTElegido);
      console.log(this.referenciaTitularesElegidos[i]);

    }
  }

  changeCheckboxReferenciaComercio(i){
    this.referenciaComercios[i].referenciaCliente = !this.referenciaComercios[i].referenciaCliente;
    if (this.referenciaComercios) {
      let itemRTElegido = {
        item: this.referenciaComercios[i].item,
        checkboxElegido: this.referenciaComercios[i].referenciaCliente,
      };
      this.referenciaComerciosElegidos[i].referenciaCliente = !this.referenciaComerciosElegidos[i].referenciaCliente;
      console.log(itemRTElegido);
      console.log(this.referenciaComerciosElegidos[i]);
    }

    // Establecer Valor de Rerencia Atutomatica
    let cantidadItemsReferenciaIniciales = this.referenciaComerciosElegidos.length;

    // Calculo del peso de las respuestas
    let refElegidasComercios = this.getItemsReferenciasComercio();
    let positivos = 0;
    refElegidasComercios.forEach(element => {
      positivos = positivos + element.peso;
    });

    this.calificacionComercio = positivos / cantidadItemsReferenciaIniciales;
    console.log('POSTIVOS:::::::::::', positivos , 'CALIFICACION:::: ', this.calificacionComercio);

    let parte = 1 / this.tiposReferencias.length;

    if (this.calificacionComercio >= 0 && this.calificacionComercio <= parte) {
        this.tipoReferenciaComercio.setValue('5b684e87e4958a3e0cbfddc0'); // calificacion mala
    } else {
      if (this.calificacionComercio > parte && this.calificacionComercio <= 2 * parte){
        this.tipoReferenciaComercio.setValue('5b684e87e4958a3e0cbfddbf'); // calificacion regular
      } else {
        if (this.calificacionComercio > 2 * parte && this.calificacionComercio <= 3 * parte){
          this.tipoReferenciaComercio.setValue('5b684e87e4958a3e0cbfddbe'); // calificacion buena
        }
      }
    }





   /*  let valoresDeCalificacion = this.tiposReferencias.length;
    // Ordeno el array de tipos referencias (bueno, regular, malo) por el campo orden DESCENDENTE
    this.tiposReferencias.sort(function(a, b) {
      return  a.orden - b.orden;
    });
    let rango = 1 / valoresDeCalificacion;
    let o = (this.calificacionComercio / rango).toString();
    // tslint:disable-next-line:radix
    let orden = parseInt(o);
    for (let i = 0; i < this.tiposReferencias.length; i++){
      if (this.tiposReferencias[i].orden === orden){
          console.log(' LA CALIFICACION FINAL ES XXXXXX :', this.tiposReferencias[i]);
      }
    } */

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
    let tipoDeAlta: string;
    let comercio: any;

     // 1: si dni no es vacio
     if ( this.cuit.value !== '') {
        // 2: Si el Comercio con Cuit existe:
        this.clientesService.postGetComercioPorCuit(this.session, cuit).subscribe( response => {
              this.comercio = response['comercio'][0];
              console.log('Comercio Buscado: ', this.comercio);
              this.cargarComercioForm(this.comercio);
        }, err => {
              // 3: Si no existe el comercio, hay que darle de alta
              let resp = confirm('Comercio Inexistente, quiere darle de Alta?');
              if (resp) {
                  tipoDeAlta = 'NoExisteComercio';
                  comercio = {
                      cuit: this.cuit.value,
                      idCliente: this.cliente._id
                  };
                  this.hijoComercio.recibePametros(comercio, tipoDeAlta);
                  this.ngxSmartModalService.getModal('comercioModal').open();
              }
          });
    } else {
      alert('Debe ingresare un número de Dni');
    }
  }

  buscarGarantePorDni() {
    let dni = this.dniGarante.value;
    let tipoDeAlta: string;
    let persona: any;
    this.switchClienteGarante = 'GARANTE';


    // 1: si dni no es vacio
    if ( this.dniGarante.value !== '') {
      // 2: Si el Garante existe:
      this.clientesService.postGetClientePorDni(this.session, dni).subscribe( response => {
            this.garante = response['clientes'][0];
            this.cargarGaranteForm(this.garante);
      }, err => {
            // 3: Si no existe el garante, puede ser una persona, entonces llenar datos de persona
            this.usuariosService.postGetPersona(this.session.token, dni).subscribe(response => {
              persona = response['personaDB'][0];
              tipoDeAlta = 'ExistePersona';
              this.hijo.recibePametros(persona, tipoDeAlta);
              this.ngxSmartModalService.getModal('clienteModal').open();
            }, err => {
              // 4: Si no es persona, entonces hay que darle de alta con ID Persona 0
              let resp = confirm('Garante Inexistente, quiere darle de Alta?');
              if (resp) {
                tipoDeAlta = 'NoExistePersona';
                persona = {
                  dni: this.dniGarante.value,
                };
                this.hijo.recibePametros(persona, tipoDeAlta);
                this.ngxSmartModalService.getModal('clienteModal').open();
              }
            });
      });
    } else {
      alert('Debe ingresare un número de Dni');
    }
  }

  cargarGaranteForm(garante: any) {
    this.apellidosGarante.setValue(garante.titular.apellidos);
    this.nombresGarante.setValue(garante.titular.nombres);
    this.fechaNacimientoGarante.setValue(this.utilidadesService.formateaDateAAAAMMDD(garante.titular.fechaNacimiento));
  }
  cargarComercioForm(comercio: any) {
    this.razonSocial.setValue(comercio.razonSocial);
  }


  // METODO QUE COMUNICA AL HIJO FormClienteCOmponent con este FOrm que es el PADRE
  // ------------------------------------------------------------------------------
  showCliente(event): void {
/*     console.log('CLIENTE GUARDADO: ', event.cliente);
    console.log('CLIENTE RESULT: ', event.result);
 */
    switch (this.switchClienteGarante) {
        case 'CLIENTE':
          this.buscarClientePorDni();
          break;
        case 'GARANTE':
        this.buscarGarantePorDni();
        break;
    }
  }
  showComercio(event): void {
    this.buscarComercioPorCuit();
    console.log('COMERCIO GUARDADO: ', event.comercio);
  }



  // TEST
  buscarCreditoPorID(){
    this.creditosService.postGetCreditoPorId('5b85266bec40c800143fc5e1', this.session.token).subscribe( result => {
        console.log(result['credito']);
    });
  }


}
