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
    this.session.token = this.loginService.getTokenDeSession();

    this.router.params.subscribe(params => {
      this.idDni = params['id'];

      console.log(this.idDni);
      this.evento = params['evento'];
      console.log(this.evento);

      if (this.evento === 'view') { // si es view carga controles deshabilitados, si es edit, habilitados
        this.habilitarControles = false;


      } else {
        this.habilitarControles = true;
      }
       });
    /* this.cargarTablaCreditos();
    this.cargarformControls();


    let creditos : TableCreditos;

    this.thisCreditos.forEach(element =>{
      creditos = element;
    });
    this.cargarFormConDatos(creditos); */
  }

  cargarTablaCreditos(){

    this.newSession = ({
      _id: this.idDni,
      token: this.session.token
    });

    this.creditosService.postGetCreditoPorId(this.newSession._id,this.newSession.token).subscribe((response: TableCreditos[]) => {
      this.thisCreditos = response['credito'];
    });
    this.thisCreditos.forEach(element=>{
      element.estado.estadoTerminal;
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

  cargarFormConDatos(datosCreditos: TableCreditos){

    this.dni.setValue(datosCreditos.cliente.titular.dni);
    this.apellidos.setValue(datosCreditos.cliente.titular.apellidos);
    this.nombres.setValue(datosCreditos.cliente.titular.nombres);
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

    this.planPago = {
      montoSolicitado: this.montoSolicitado.value,
      cobranzaEnDomicilio: this.cobroDomicilio.value,
      cantidadCuotas: this.plan.value,
      tasa: this.planElegido.tasa,
      diasASumar: this.tipoPlanElegido.diasASumar,
    };


    this.creditosService.postGetPlanDePago(this.planPago).subscribe(response => {
      let p = response['planPago'];
      // Asignacion para cargar la tabla de datos
      this.characters = p.planPagos;
    });

  }


  onChangeTipoPlanes() {
    this.tipoPlanElegido = this.tiposPlanes.find(x => x.nombre === this.creditoForm.get('tipoDePlan').value);
    this.planes = this.tipoPlanElegido.plan;
  }

  onChangePlanes() {
    let planCuotaElegido = parseInt(this.creditoForm.get('plan').value, 10);
    this.planElegido = this.planes.find(x => x.cantidadCuotas === planCuotaElegido);
  }

  buscarClientePorDni() {
    let dni = this.dni.value;
    let tipoDeAlta: string;
    let persona: any;
    this.switchClienteGarante = 'CLIENTE';

    // 1: si dni no es vacio
    if (this.dni.value !== '') {
      // 2: Si el Cliente existe:
      this.clientesService.postGetClientePorDni(this.session, dni).subscribe(response => {
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

  buscarComercioPorCuit() {
    let cuit = this.cuit.value;
    let tipoDeAlta: string;
    let comercio: any;

    // 1: si dni no es vacio
    if (this.cuit.value !== '') {
      // 2: Si el Comercio con Cuit existe:
      this.clientesService.postGetComercioPorCuit(this.session, cuit).subscribe(response => {
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
    if (this.dniGarante.value !== '') {
      // 2: Si el Garante existe:
      this.clientesService.postGetClientePorDni(this.session, dni).subscribe(response => {
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

  getReferenciaCliente(){

  }
}
