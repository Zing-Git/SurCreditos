import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CreditosService } from "../../../modules/servicios/creditos/creditos.service";
import { Session } from "../../../modelo/util/session";
import { LoginService } from "../../../modules/servicios/login/login.service";
import { NgxSmartModalService } from "ngx-smart-modal";
import swal from "sweetalert2";
import { ModalCuotasCobranzaComponent } from '../modal-cuotas-cobranza/modal-cuotas-cobranza.component';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: "app-elegir-cuotas",
  templateUrl: "./elegir-cuotas.component.html",

})
export class ElegirCuotasComponent implements OnInit {
  // ESTABA ACTIVO
   // @ViewChild(ModalCuotasCobranzaComponent) hijoModal: ModalCuotasCobranzaComponent;
   @Output() pasameCreditoACobrar = new EventEmitter();


  session = new Session();
  charactersCreditos: any[];
  cuotas: any[];

  settings = {
    actions: {
      columnTitle: "Accion",
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: "right",
      custom: [
        {
          name: "mostrarCuotas",
          title: "Seleccionar"
        }
      ]
    },
    columns: {
      nuevoLegajo: {
        title: "Legajo",
        width: "10%",
        filter: false,
        valuePrepareFunction: (cell, row) =>
          row.legajoPrefijo + " - " + row.legajo
      },
      titular: {
        title: 'Titular',
        width: '15%',
        filter: false,
        valuePrepareFunction: (cell, row) =>
          row.titularApellidos + ', ' + row.titularNombres
      },

      totalAPagar: {
        title: 'Total a Pagar',
        width: '20%',
        filter: false,
        valuePrepareFunction: value => {
          return value === 'totalAPagar'
            ? value
            : Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS'
              }).format(value);
        }
      },
      tipoPlan: {
        title: 'Plan',
        width: '10%',
        filter: false
      }
    },
    pager: {
      display: true,
      perPage: 5
    },
    noDataMessage: 'El cliente no tiene creditos...'
  };

  constructor(
    private creditosServices: CreditosService,
    private loginService: LoginService,
    private ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();
  }

  buscarCreditoPorDni(dni: any) {

    if (dni !== '') {
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
    } else {
    }
  }




  onCustom(event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.dni}`);
    let evento = (`${event.action}`);
    const id = (`${event.data._id}`);

    // console.log('ELIGIO EN elegircuotascomponenent:' + (`${event.data.legajoPrefijo}`) + ' - ' + (`${event.data.legajo}`));


    switch (evento) {
      case 'mostrarCuotas': {
        this.mostrarCuotas(id);
        break;
      }


    }
  }

  // COMUNICACION CON EL HIJO MODAL-------------------------

  mostrarCuotas(idCredito: string) {
    let cuotasNoPagas: any[];
    // console.log('Mostrando creditos: ' + this.charactersCreditos);
    this.charactersCreditos.forEach(x => {
      if (idCredito == x._id) {
         this.cuotas = x.cuotas;
      }
    });

    let par : any[] = [];
    par.push(this.cuotas);
    par.push(this.charactersCreditos);
    par.push(idCredito);
    par.push(this.session.token);

    this.pasameCreditoACobrar.emit(par);

  }





}
