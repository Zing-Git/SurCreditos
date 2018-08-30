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

    this.creditos =  this.creditosService.Storage;
    this.router.params.subscribe(params => {
      this.idDni = params['id'];
      //creditos = params['character'];


     //this.session.token = this.loginService.getTokenDeSession();
      //console.log(this.idDni);
      this.evento = params['evento'];
      console.log(this.evento);

      if (this.evento === 'view') { // si es view carga controles deshabilitados, si es edit, habilitados
        this.habilitarControles = false;
      } else {
        this.habilitarControles = true;
      }
    });
    this.cargarformControls();
    console.log(this.creditos.cliente.titular.dni);
    console.log(this.creditos.cliente.titular.fechaNacimiento);
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


  /* get documentacion() {    return this.creditoForm.get('documentacion');  } */
  get numeroLegajo() { return this.creditoForm.get('numeroLegajo'); }
  get tipoReferenciaTitular() { return this.creditoForm.get('tipoReferenciaTitular'); }
  get itemsReferenciasTitular() { return this.creditoForm.get('itemsReferenciasTitular'); }
  get notaComentarioTitular() { return this.creditoForm.get('notaComentarioTitular'); }
  get tipoReferenciaComercio() { return this.creditoForm.get('tipoReferenciaComercio'); }
  get itemsReferenciasComercio() { return this.creditoForm.get('itemsReferenciasComercio'); }
  get notaComentarioComercio() { return this.creditoForm.get('notaComentarioComercio'); }


  //1_ creo el formulario vacio
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
          numeroLegajo: new FormControl('', [Validators.required]),
          tipoReferenciaTitular: new FormControl('', [Validators.required]),
          itemsReferenciasTitular: new FormArray(this.controls),
          notaComentarioTitular: new FormControl('', [Validators.required]),

          tipoReferenciaComercio: new FormControl('', [Validators.required]),
          itemsReferenciasComercio: new FormArray(this.controls),
          notaComentarioComercio: new FormControl(''),




     // this.creditoForm = this.fb.group({
        // clase usuario

        //dni: new FormControl('', [Validators.required]),
        //apellidos: new FormControl('', [Validators.required]),
       // nombres: new FormControl('', [Validators.required]),
       // fechaNacimiento: new FormControl('', [Validators.required]),

        // datos del credito


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

      //this.documentaciones.disable();
      this.numeroLegajo.disable();
      this.tipoReferenciaTitular.disable();
      this.itemsReferenciasTitular.disable();
      this.notaComentarioTitular.disable();


      //tipoReferenciaComercio: new FormControl('', [Validators.required]),
     // itemsReferenciasComercio: new FormArray(this.controls),
     // notaComentarioComercio: new FormControl(''),

    }

  }

  cargarFormConDatos(){

    this.dni.setValue(this.creditos.cliente.titular.dni);
    this.apellidos.setValue(this.creditos.cliente.titular.apellidos);
    this.nombres.setValue(this.creditos.cliente.titular.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(this.creditos.cliente.titular.fechaNacimiento));

    this.montoSolicitado.setValue( Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+this.montoSolicitado));

    this.dniGarante.setValue(this.creditos.garante.titular.dni);
    this.apellidosGarante.setValue(this.creditos.garante.titular.apellidos);
    this.nombresGarante.setValue(this.creditos.garante.titular.nombres);
    this.fechaNacimientoGarante.setValue(this.utilidadesService.formateaDateAAAAMMDD(this.creditos.garante.titular.fechaNacimiento));

    this.cuit.setValue(this.creditos.comercio.cuit);

    this.razonSocial.setValue(this.creditos.comercio.razonSocial);

    this.documentosAPresentar = this.creditos.documentos;
    this.numeroLegajo.setValue(this.creditos.legajo);
    this.referenciaTitulares = this.creditos.comercio.referencias;
    this.cobroDomicilio.setValue(this.creditos.tieneCobranzaADomicilio);

    this.tiposReferencias = this.creditos.comercio.referencias;
   // this.referenciaTitulares = this.creditos.cliente.titular;
  }

    /*
cargarUsuarioAControles(usuario: any){
    // Persona
    this.tipoDni.setValue(usuario.persona.tipoDni.nombre, {onlySelf: true});
    this.dni.setValue(usuario.persona.dni);
    this.apellidos.setValue(usuario.persona.apellidos);
    this.nombres.setValue(usuario.persona.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(usuario.persona.fechaNacimiento));
    this.inicializarControlesUsandoGETServices(usuario);

    // Domicilio:
    this.pais.setValue(usuario.persona.domicilio.pais);
    // Provincias y Localidades se cargan en el metodo cargarUsuarioAControles, por ser anidada la consulta al WService

    this.barrio.setValue(usuario.persona.domicilio.barrio);
    this.calle.setValue(usuario.persona.domicilio.calle);
    this.numeroCasa.setValue(usuario.persona.domicilio.numeroCasa);
    this.estadoCasa.setValue(usuario.persona.domicilio.estadoCasa.nombre, {onlySelf: true});
    // this.usuarioForm.controls['estadoCasa'].setValue(usuario.persona.domicilio.estadoCasa.nombre, {onlySelf: true});
    // Usuario:
    this.nombreUsuario.setValue(usuario.nombreUsuario);
    this.clave.setValue('');
    this.rol.setValue(usuario.rol.nombre, {onlySelf: true});
    // Contactos:
    for (const contacto of usuario.contactos) {
        switch (contacto._id) {
          case '5b2bae57b44803001445c1d7': {
            this.codigoPais1.setValue(contacto.codigoPais);
            this.codigoArea1.setValue(contacto.codigoArea);
            this.numero1.setValue(contacto.numeroCelular);
            break;
          }
          case '5b2bae57b44803001445c1d9': {
            this.codigoPais2.setValue(contacto.codigoPais);
            this.codigoArea2.setValue(contacto.codigoArea);
            this.numero2.setValue(contacto.numeroCelular);
            break;
          }
          case '5b2bae57b44803001445c1db': {
            this.email.setValue(contacto.email);
            break;
          }
      }
    }
  }
    */


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

  changeCheckboxReferenciaComercio(i) {
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
  }

  calcularPlanDePago() {

    let p : any[];
    this.creditos.planPagos.cuotas.forEach(element =>{

      this.planPago = {
        montoSolicitado: element.montoCapital,
        cobranzaEnDomicilio: this.creditos.tieneCobranzaADomicilio,
        cantidadCuotas: this.creditos.cantidadCuotas,
        tasa: +this.creditos.porcentajeInteres,
        diasASumar: 0
      };

      p.push(this.planPago);
    })

    this.characters = p;
  }


  getReferenciaCliente(){

  }
}
