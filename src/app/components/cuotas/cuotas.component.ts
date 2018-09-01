import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Session } from '../../modelo/util/session';

import { CreditosService } from '../../modules/servicios/creditos/creditos.service';
import { LoginService } from '../../modules/servicios/login/login.service';
import { Router } from '@angular/router';
import { ClientesService } from '../../modules/servicios/clientes/clientes.service';
import { DatePipe } from '@angular/common';
import { Cliente } from '../../modelo/negocio/cliente';
import { OrdenPagoService } from '../../modules/servicios/ordenPago/orden-pago.service';
import { TableOrdenDePago } from '../orden-de-pago/form-orden-de-pago/TableOrdenPago';
import 'jspdf-autotable';
import { TableCreditos } from '../creditos/crud-creditos/TableCreditos';
declare let jsPDF;

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.css']
})
export class CuotasComponent implements OnInit {

  ordenDePagoForm: FormGroup;
  session = new Session();
  characters: any[];
  characterAprobados: TableOrdenDePago[];
  cliente: Cliente;
  numeroFactura: string;
  formas: any[];

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
      legajo_prefijo: {
        title: 'Num. Orden',
        width: '10%',
        valuePrepareFunction: (cell, row) => row.numeroOrden
      },
      nombre: {
        title: 'Nombre Completo',
        width: '15%',
        valuePrepareFunction: (cell, row) => row.cliente.titular.apellidos + ', ' + row.cliente.titular.nombres
      },

      montoAPagar: {
        title: 'Monto de Credito',
        width: '30%',
        valuePrepareFunction: (value) => {
          return value === 'montoPedido' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      fechaGeneracion: {
        title: 'Fecha Generación',
        width: '15%',
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
      },
      fechaPago: {
        title: 'Fecha de Alta',
        width: '15%',
        filter: false,
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
      },
    },
    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'El Cliente no tiene orden de Pago...'
  };
  constructor(private fb: FormBuilder,
    private clientesServices: ClientesService,
    private loginService: LoginService,
    private router: Router,
    private datePipe: DatePipe,
    private ordenDePago: OrdenPagoService) { }

  ngOnInit() {

    this.session.token = this.loginService.getTokenDeSession();
    this.ordenDePagoForm = this.fb.group({
      dni: new FormControl('', [Validators.required])
    });

    this.cargarControlesCombos();
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

  get dni() { return this.ordenDePagoForm.get('dni'); }

  buscarCuotasPorDni() {
    let dni = this.dni.value;

    if (this.dni.value !== '') {
      this.ordenDePago.postGetOrdenPagoPorDni(this.session, dni).subscribe((response: TableOrdenDePago[]) => {
        this.characters = response['ordenDb'];
      });
    }
    
      console.log(this.characters);
    
  }

  private cargarControlesCombos() {

    this.clientesServices.postGetCombos().subscribe(result => {
      //this.provincias = result['respuesta'].provincias;
      this.formas = result['respuesta'].formasPago;
      // this.tiposPlanes = result['respuesta'].tiposPlanes;
      //console.log(this.formas[0].formaPago);
    });

  }

}
