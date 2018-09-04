import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Session } from '../../modelo/util/session';
import { LoginService } from '../../modules/servicios/login/login.service';
import { Router } from '@angular/router';
import { ClientesService } from '../../modules/servicios/clientes/clientes.service';
import { DatePipe } from '@angular/common';
import { Cliente } from '../../modelo/negocio/cliente';
import { OrdenPagoService } from '../../modules/servicios/ordenPago/orden-pago.service';
import { TableOrdenDePago } from '../orden-de-pago/form-orden-de-pago/TableOrdenPago';
import 'jspdf-autotable';
import { Cuota } from '../../modelo/negocio/cuota';
import { CreditosService } from '../../modules/servicios/creditos/creditos.service';
import { TableCreditos } from '../creditos/crud-creditos/TableCreditos';
import { TableClientes } from '../clientes/crud-clientes/TableClientes';
declare let jsPDF;

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.css']
})
export class CuotasComponent implements OnInit {

  cuotasForm: FormGroup;
  session = new Session();
  characters: TableOrdenDePago;
  clientes: any;
  cuotas: any[];

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
          name: 'imprimirPDF',
          title: 'Generar Cupon'
        }
      ],
    },
    columns: {
      orden: {
        title: 'Num. Orden',
        width: '10%'
      },
      cuotaPagada: {
        title: 'Estado de Cuota',
        width: '15%'
      },

      montoPendienteDePago: {
        title: 'Monto a Pagar',
        width: '30%',
        valuePrepareFunction: (value) => {
          return value === 'montoPedido' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      fechaVencimiento: {
        title: 'Fecha Vencimiento',
        width: '15%',
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
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
    private datePipe: DatePipe,
    private ordenDePago: OrdenPagoService,
  private clientesServices : ClientesService) { }

  ngOnInit() {

    this.session.token = this.loginService.getTokenDeSession();
        
    this.cuotasForm = this.fb.group({
      dni: new FormControl('')
    });

    //this.cargarControlesCombos();
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
      case 'edit': {

        break;
      }

      case 'imprimirPDF': {
        this.imprimirPDF(id);
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }

  imprimirPDF(id: string){

  }

  get dni() { return this.cuotasForm.get('dni'); }

  buscarCuotasPorDni() {
    this.session.token = this.loginService.getTokenDeSession();
    if (this.dni.value !== '') {
      this.ordenDePago.postGetOrdenPagoPorDni(this.session, this.dni.value).subscribe((response: TableOrdenDePago[]) => {
        this.characters = response['ordenDb'][0];
        //console.log(this.characters.credito);
        
      });
    }
    //this.cuotas = this.characters.credito.planPagos.cuotas;
    
  }

}
