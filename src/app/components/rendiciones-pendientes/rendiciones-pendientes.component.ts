import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import { CajaService } from '../../modules/servicios/caja/caja.service';
import { Session } from 'src/app/modelo/util/session';
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-rendiciones-pendientes',
  templateUrl: './rendiciones-pendientes.component.html'
})
export class RendicionesPendientesComponent implements OnInit {
  session = new Session();
  rendicionesPendientes = new Array();
  totalCobrado = 0;
  totalAcobrar = 0;

  settings = {

    actions: {
      columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',
      custom: [
      ],
    },
    columns: {
        item: {
        title: 'Id',
        width: '10%',
        filter: true,
        sort: true,
        },
        /* _id: {
        title: 'Identificador',
        width: '15%',
        filter: true,
        sort: true,

      }, */
      usuario: {
        title: 'Cobrador',
        width: '10%',
        filter: true,
        sort: true,
      },
      estado: {
        title: 'Estado',
        width: '10%',
        filter: true,
        sort: true,
      },
      fechaAlta:{
        title: 'Fecha',
        width: '12%',
        valuePrepareFunction: (cell, row) => { return moment(row.fechaAlta).format('DD-MM-YYYY') }
      },
      saldoACobrar: {
        title: 'A Cobrar',
        width: '10%',
        valuePrepareFunction: (value) => {
          return value === 'saldoACobrar' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      /* montoCobrado: {
        title: 'Cobrado',
        width: '10%',
        valuePrepareFunction: (value) => {
          return value === 'montoCobrado' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      }, */
    /*   cantidadCuotas: {
        title: 'Cuotas',
        width: '5%'
      }, */

    },
    pager: {
      display: true,
      perPage: 10
    },
  };

  constructor(private router: Router, private loginService: LoginService, private cajaService: CajaService) { }

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();
    this.cajaService.postGetNominasDeRendionDeCobranzasPendientes(this.session.token).subscribe( result => {
        // this.configuraciones = result;
        // console.log(result);
        this.crearTablaRendiciones(result['asignaciones']);

        }, err => {
          swal(
            'No se pudo obtener la lista de rendiciones pendientes!',
            'Intente nuevamente mas tarde',
            'error'
          );
        });
  }

  crearTablaRendiciones(zasignaciones: any[]) {
    let lista = new Array();
    let i = 1;

    zasignaciones.forEach(element => {

      let zsaldoACobrar = 0;
      let zsaldoACobrado = 0;
      element.detalleASignacion.forEach(element2 => {
        zsaldoACobrar = zsaldoACobrar + element2.saldoACobrar;
        zsaldoACobrado = zsaldoACobrado + element2.saldoACobrado;
      });

      let itemAsignacion = {
        item : i++,
        _id : 	element._id,
        usuario: element.usuario.nombreUsuario,
        estado: element.estado,
        fechaAlta: element.fechaAlta,

        saldoACobrar: zsaldoACobrar,
        montoCobrado: zsaldoACobrado,
        // cantidadCuotas: element.detalleASignacion.cuotas.length,
      };
      lista.push(itemAsignacion);
      this.totalAcobrar = this.totalAcobrar + zsaldoACobrar;
    });

    this.rendicionesPendientes = lista;
    // console.log(this.rendicionesPendientes);
  }

  onCustom(event) {

  }

}
