import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Session } from '../../modelo/util/session';
import { LoginService } from '../../modules/servicios/login/login.service';
import { Router } from '@angular/router';
import 'jspdf-autotable';
import { CreditosService } from '../../modules/servicios/creditos/creditos.service';
import { ModalCuotasComponent } from './modal-cuotas/modal-cuotas.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import swal from 'sweetalert2';
import * as moment from 'moment';

declare let jsPDF;

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.css']
})
export class CuotasComponent implements OnInit {

  @ViewChild(ModalCuotasComponent) hijoModal: ModalCuotasComponent;
  cuotasForm: FormGroup;
  session = new Session();
  charactersCreditos: any[];
  clientes: any;
  cuotas: any[];
  //charactersOrdenPago: any[];

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
          name: 'mostrarCuotas',
          title: 'Seleccionar'
        }
      ],
    },
    columns: {
      fechaAlta: {
        title: 'Fecha',
        width: '15%',
        filter: false,
        valuePrepareFunction: (cell, row) => { return moment(row.fechaAlta).format('DD-MM-YYYY') }
      },
      titularDni: {
        title: 'Dni',
        width: '10%',
        filter: false,
        valuePrepareFunction: (cell, row) => row.titularDni
      },
      nuevoLegajo: {
        title: 'Legajo',
        width: '10%',
        filter: false,
        valuePrepareFunction: (cell, row) => row.legajoPrefijo + ' - ' + row.legajo
      },
      titular: {
        title: 'Nombre titular',
        width: '15%',
        filter: false,
        valuePrepareFunction: (cell, row) => row.titularApellidos + ', ' + row.titularNombres
      },
      capital: {
        title: 'Credito por',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'capital' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      CantidadCuotas: {
        title: 'Cuotas',
        width: '10%',
        filter: false,
      },
      tipoPlan: {
        title: 'Tipo Plan',
        width: '10%',
        filter: false,
      }
    },
    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'El Cliente no tiene Cuotas...'
  };
  constructor(private fb: FormBuilder,
    private creditosServices: CreditosService,
    private loginService: LoginService,
    private router: Router,
    private ngxSmartModalService: NgxSmartModalService) { }

  get dni() { return this.cuotasForm.get('dni'); }

  ngOnInit() {

    this.session.token = this.loginService.getTokenDeSession();
    this.cuotasForm = this.fb.group({
      dni: new FormControl('')
    });
    this.charactersCreditos = new Array();
  }

  onCustom(event) {
    //alert(`Custom event '${event.action}' fired on row №: ${event.data._id}`);
    const evento = (`${event.action}`);
    const dni = (`${event.data.dni}`);
    const id = (`${event.data._id}`);

    switch (evento) {
      case 'view': {
        //this.router.navigate(['formclienteviewedit', evento, dni]);
        this, this.router.navigate(['viewcredito', evento, id]);
        break;
      }
      case 'mostrarCuotas': {
        this.mostrarCuotas(id);
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }

  buscarCreditoPorDni() {
    let dni = this.dni.value;
    //console.log(dni)
    if (dni !== '') {
      this.creditosServices.postGetCreditosVigentes(this.session, dni).subscribe(response => {
        let charactersCreditos = response['creditos'];

        console.log(charactersCreditos);

        if (typeof charactersCreditos === 'undefined') {
          swal('info', 'Credito esta pagado o no existe!!', 'info');
          //location.reload();
        } else {
          this.charactersCreditos = JSON.parse(JSON.stringify(charactersCreditos));
        }

      });

    }else{

    }

  }

  mostrarCuotas(idCredito: string) {
    //console.log('id de credito.........' + idCredito);
    this.charactersCreditos.forEach(x => {
      if (idCredito == x._id) {
        this.cuotas = x.cuotas;

      }
    });
    //console.log('CUOTAS PARA ENVIAR A --->' + this.cuotas);

    this.hijoModal.getDataFromCuotas(this.cuotas, this.charactersCreditos, idCredito, this.session.token);
    this.ngxSmartModalService.getModal('cuotaModal').open();
    this.ngOnInit();
  }

  onEnterDniCliente(){
    this.buscarCreditoPorDni();
  }


}
