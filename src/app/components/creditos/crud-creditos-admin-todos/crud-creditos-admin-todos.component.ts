import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
// import * as jsPDF from 'jspdf';
import "jspdf-autotable";
declare let jsPDF;

import { LoginService } from "../../../modules/servicios/login/login.service";
import { ClientesService } from "../../../modules/servicios/clientes/clientes.service";
import { CreditosService } from "../../../modules/servicios/creditos/creditos.service";
import { UsuariosService } from "../../../modules/servicios/usuarios/usuarios.service";

import { Session } from "../../../modelo/util/session";
import { TableCreditos } from "./../../creditos/crud-creditos/TableCreditos";
import * as moment from "moment/moment";
import { EstadoCasa } from "../../../modelo/negocio/estado-casa";
import { TableUsuarios } from "../../usuarios/crud-usuarios/TableUsuarios";
import { Estado } from "../../../modelo/negocio/estado";
import { element } from "@angular/core/src/render3/instructions";
import swal from "sweetalert2";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: "app-crud-creditos-admin-todos",
  templateUrl: "./crud-creditos-admin-todos.component.html"
})
export class CrudCreditosAdminTodosComponent implements OnInit {
  message = "";
  charactersNuevo = [];
  characters: TableCreditos[];
  character: TableCreditos;
  estadosCasa: EstadoCasa[];
  usuarios: TableUsuarios[];
  estados: Estado[];
  session = new Session();
  numeroFactura: string;

  lineaDeCarro = 40; // para reporte general
  carroIndividual = 50; //para reporte individual
  cantidadTotal = 0;

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
          name: "view",
          title: "Ver"
        },
     /*    {
          name: "aprobar",
          title: "Aprobar /"
        },
        {
          name: "rechazar",
          title: "Rechazar /"
        }, */
        /* {
          name: "derivar",
          title: "Derivar a Root /"
        }, */


        /* {
          name: "PDF",
          title: "PDF"
        } */


      ]
    },
    columns: {
      fechaAlta: {
        title: "Fecha",
        width: "12%",
        filter: true,
        sort: true,
        valuePrepareFunction: (cell, row) => { return moment(row.fechaAlta).format('DD-MM-YYYY') }
      },
      legajo_prefijo: {
        title: "Legajo",
        width: "4%",
        filter: true,
        sort: true,
        // valuePrepareFunction: (cell, row) => row.legajo_prefijo + "-" + row.legajo
      },
    /*   legajo: {
        title: "Legajo",
        width: "4%",
        filter: true,
        sort: true
      }, */
      dni: {
        title: "Dni",
        width: "10%",
        // valuePrepareFunction: (cell, row) => row.cliente.titular.dni
      },
      nombreApellido: {
        title: "Titular",
        width: "17%",
        filter: true,
        sort: true,
        // valuePrepareFunction: (cell, row) => row.cliente.titular.apellidos + ", " + row.cliente.titular.nombres
      },
      vendedor: {
        title: "Vendedor",
        width: "17%",
        filter: true,
        sort: true,
      },
      /* cuit: {
        title: "Cuit",
        width: "10%",
        filter: true,
        sort: true,
        // valuePrepareFunction: (cell, row) => row.comercio.cuit
      }, */
      /* razonSocial: {
        title: "Comercio",
        width: "15%",
        // valuePrepareFunction: (cell, row) => row.comercio.razonSocial
      }, */

      montoPedido: {
        title: "Credito",
        width: "10%",
        valuePrepareFunction: value => {
          return value === "montoPedido"
            ? value
            : Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS"
              }).format(value);
        }
      },
      estado: {
        title: "Estado",
        width: "10%",
        // valuePrepareFunction: (cell, row) => row.estado.nombre
      }
    },
    pager: {
      display: true,
      perPage: 10
    }
  };

  constructor(
    private router: Router,
    private creditosService: CreditosService,
    private loginService: LoginService,
    private clientesServices: ClientesService,
    private usuariosServices: UsuariosService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();

    this.spinnerService.show();
    this.creditosService
      .postGetAllCreditosTodosLosUsuarios(this.session)
      .subscribe((response: TableCreditos[]) => {
        this.characters = response["credito"];
        this.spinnerService.hide();

        this.charactersNuevo = this.convertirDataSourceParaTabla(this.characters, '');
      } // , () => this.spinnerService.hide()
      );
    this.cargarControlesCombos();
    /* this.getAllUsuarios(); */
  }

  convertirDataSourceParaTabla(tabla: any[], filtro: string): any[] {
    let arrayCreditos = [];
    let arrayCreditosFiltrados = [];
    tabla.forEach(element => {

      let fila = {
        _id: element._id,
        fechaAlta: element.fechaAlta,
        legajo_prefijo: element.legajo_prefijo + '-' + element.legajo,
        legajo: element.legajo,
        dni: element.cliente.titular.dni,
        nombreApellido: element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres,
        vendedor: element.usuario.persona.apellidos + ', ' + element.usuario.persona.nombres + ' (' + element.usuario.persona.domicilio.localidad + ')',
        // cuit: element.comercio.cuit,
        // razonSocial: element.comercio.razonSocial,
        montoPedido: element.montoPedido,
        estado: element.estado.nombre,
      };

      if (element.estado.nombre === 'PENDIENTE DE REVISION' && filtro === 'PENDIENTE DE REVISION') {
        arrayCreditosFiltrados.push(fila);
      } else {
        arrayCreditos.push(fila);
      }
    });

    if (filtro === 'PENDIENTE DE REVISION') {
      return arrayCreditosFiltrados;
    } else {
      return arrayCreditos;
    }
  }


  filtrarEnEsperaDeAprobacion() {
    this.charactersNuevo = this.convertirDataSourceParaTabla(this.characters, 'PENDIENTE DE REVISION');
  }
  filtrarTodos(){
    this.charactersNuevo = this.convertirDataSourceParaTabla(this.characters, '');
  }


  private cargarControlesCombos() {
    this.clientesServices.postGetCombos().subscribe(result => {
      this.estadosCasa = result["respuesta"].estadosCasa;
      this.estados = result["respuesta"].estadosCredito;
    });
  }
  private getAllUsuarios() {
    this.usuariosServices
      .postGetAllUsuarios(this.session)
      .subscribe((response: TableUsuarios[]) => {
        this.usuarios = response["respuesta"];
      });
  }
  private getUsuario(id: string): string {
    let miUsuario: string;
    if (this.usuarios == null) {
      return this.session.nombreUsuario;
    } // retorno si el listado esta vacio
    this.usuarios.forEach(element => {
      if (element._id == id) {
        return element.nombreUsuario;
      }
    });
    //console.log(miUsuario);
    return miUsuario;
  }

  onCustom(event) {
    //alert(`Custom event '${event.action}' fired on row №: ${event.data._id}`);
    const evento = `${event.action}`;
    const dni = `${event.data.dni}`;
    const id = `${event.data._id}`;

    switch (evento) {
      case "view": {
        this.characters.forEach(element => {
          if (element._id === id) {
            this.character = element;
          }
        });
        this.creditosService.Storage = this.character;
        this.router.navigate(["viewcredito", evento, id]);
        break;
      }
      case "aprobar": {
        // this.router.navigate(['formclienteviewedit', evento, dni]);
        this.postAprobarRechazar(id, "APROBADO");
        break;
      }
      case "rechazar": {
        this.postAprobarRechazar(id, "RECHAZADO");
        break;
      }
      case "derivar": {
        this.postAprobarRechazar(id, "DERIVADO");
        break;
      }
      case "ver": {
        this.router.navigate(["crudcreditos"]);
        break;
      }
      case "PDF": {
        // es de getcombos
        this.clientesServices.postGetCombos().subscribe(result => {
          this.estadosCasa = result["respuesta"].estadosCasa;
          this.estados = result["respuesta"].estadosCredito;
          this.imprimirPDF(id);
        });

        /* this.imprimirPDF(id); */
        break;
      }
      default: {
        // console.log('Invalid choice');
        break;
      }
    }
  }

  postAprobarRechazar(id: string, nuevoEstado: string) {
    let idNuevoEstado: string;
    this.estados.forEach(element => {
      if (nuevoEstado == element.nombre) {
        idNuevoEstado = element._id;
      }
    });
    // console.log(idNuevoEstado);
    this.characters.forEach(element => {
      if (element._id === id) {
        if (
          element.estado.nombre === "PENDIENTE DE REVISION" ||
          element.estado.nombre === "PENDIENTE DE APROBACION" ||
          element.estado.nombre === "APROBADO"
        ) {
          let nuevoCredito = {
            idCredito: element._id,
            estado: idNuevoEstado, // '5b72b281708d0830d07f3562'        // element.estado._id
            nombre_nuevo_estado: nuevoEstado, // APROBADO RECHASADO OTRO,
            cliente: element.cliente._id,
            monto: element.montoPedido,
            nombre_estado_actual: element.estado.nombre,
            token: this.session.token
          };

          this.creditosService.postCambiarEstadoCredito(nuevoCredito).subscribe(
            result => {
              let respuesta = result;
              swal('Perfecto', 'Se actualizó el estado de Credito', 'success');
              this.filtrarTodos(); // AGREGUE ESTO PARA ACTUALIZAR LA LISTA DESPUES DE APROBAR!

            },
            err => {
              alert("Ocurrio un problema");
            }
          );
        } else {
          alert("No se puede cambiar el estado");
        }
      }
    });
  }

  imprimirPDF(id: string) {
    const doc = new jsPDF();

    ///////////////////////////////////////////////////////////////////////////////////
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle("normal");
    // const imgData = new Image();
    // tslint:disable-next-line:max-line-length
    // imgData.src = 'https://npclhg.dm.files.1drv.com/y4m9GX1-ImqUAw21oHBc1AU0cXj8xJb_B4EW3Omo1lOtFGEwYTmTagcQHp6Zn7AjSsa84JUu_H2bNDa_rY8Ubsl2hkNV4xk5zmWlUaN2tz_0i1q39QOAfWe_FLpR-Jfg_J94rvvQpLHLNw5_aT2hWdWRsBclGuCgF9U1i5taliO9DWw7sc4EnxfgcWT_WamOy60jkpOdDzEQIINslKGINAR6A?width=558&height=299&cropmode=none' ;
    // doc.addImage(imgData, 50, 50);
    doc.text("SUR Créditos", 20, 15);
    doc.setFontSize(7);
    doc.text("CREDITOS PARA COMERCIANTES", 20, 18);

    doc.setFontSize(12);

    doc.text("NOTA DE PEDIDO", 72, 30, "center");

    doc.setFontSize(10);
    doc.setTextColor(0);
    //doc.text('Vendedor: ' + this.session.nombreUsuario, 130, 20);
    const today = Date.now();
    doc.setTextColor(0);
    doc.text("Fecha: " + moment(today).format("DD-MM-YYYY"), 130, 25);

    this.characters.forEach(x => {
      if (x._id === id) {
        this.crearNumeroFactura(x.legajo_prefijo, x.legajo);
        doc.text("Legajo Nº:  " + this.numeroFactura, 130, 30);
        doc.text("Estado: " + x.estado.nombre, 130, 35);
      }
    });

    doc.setFillColor(52, 152, 219);
    doc.setTextColor(255);
    doc.setFontSize(12);
    doc.roundedRect(10, 38, 182, 8, 3, 3, "FD");
    doc.text("Datos del Titular", 100, 43, "center");

    doc.setFontSize(10);
    this.characters.forEach(element => {
      if (element._id === id) {
        doc.setTextColor(0);
        doc.text(
          "Apellido y Nombre: " +
            element.cliente.titular.apellidos +
            ", " +
            element.cliente.titular.nombres,
          20,
          53
        );
        doc.text(
          "Fecha de Nacimiento: " +
            moment(element.cliente.titular.fechaNacimiento).format(
              "DD-MM-YYYY"
            ) +
            "              D.N.I.: " +
            element.cliente.titular.dni,
          20,
          58
        );
      }
    });

    doc.setFontSize(12);
    // doc.setFillColor(52, 152, 219)
    // doc.roundedRect(10, 60, 182, 8, 3, 3, 'FD')

    // doc.setTextColor(255);
    // doc.text('Domicilio Particular', 100, 65, 'center');
    doc.text("Domicilio Particular", 20, 70);

    doc.setFontSize(10);
    doc.setTextColor(0);
    this.characters.forEach(element => {
      if (element._id === id) {
        doc.text("Calle: " + element.cliente.titular.domicilio.calle, 20, 75);
        doc.text(
          "Barrio: " + element.cliente.titular.domicilio.barrio,
          130,
          75
        );
        doc.text(
          "Localidad: " + element.cliente.titular.domicilio.localidad,
          20,
          80
        );
        doc.text(
          "Provincia: " + element.cliente.titular.domicilio.provincia,
          130,
          80
        );
        let miEstado: string;
        this.estadosCasa.forEach(estadoC => {
          if (element.cliente.titular.domicilio.estadoCasa == estadoC._id) {
            miEstado = estadoC.nombre;
          }
        });
        doc.text("Situacion de la vivienda: " + miEstado, 20, 85);
      }
    });

    doc.setFontSize(12);
    // doc.setFillColor(52, 152, 219)
    // doc.roundedRect(10, 90, 182, 8, 3, 3, 'FD')

    // doc.setTextColor(255);
    // doc.text('Domicilio Comercial', 100, 95, 'center');
    doc.text("Domicilio Comercial", 20, 100);

    doc.setFontSize(10);
    doc.setTextColor(0);
    this.characters.forEach(element => {
      if (element._id === id) {
        if (element.comercio.domicilio != null) {
          doc.text("Calle: " + element.comercio.domicilio.calle, 20, 105);
          doc.text("Barrio:" + element.comercio.domicilio.barrio, 130, 105);
          doc.text(
            "Localidad: " + element.comercio.domicilio.localidad,
            20,
            110
          );
          doc.text(
            "Provincia: " + element.comercio.domicilio.provincia,
            130,
            110
          );

          //doc.text('Celular: ', 20, 115);
          //doc.text('T. Fijo:', 80, 115)
          // doc.text('Mail:  ', 130, 115);
        } else {
          doc.text("Calle: ", 20, 105);
          doc.text("Barrio:", 130, 105);
          doc.text("Localidad: ", 20, 110);
          doc.text("Provincia: ", 130, 110);

          //doc.text('Celular: ', 20, 115);
          //doc.text('T. Fijo:', 80, 115)
          //doc.text('Mail:  ', 130, 115);
        }
      }
    });

    doc.setFontSize(12);
    doc.setFillColor(52, 152, 219);
    doc.roundedRect(10, 120, 182, 8, 3, 3, "FD");

    doc.setTextColor(255);
    doc.text("Datos del Garante", 100, 125, "center");

    doc.setFontSize(10);
    doc.setTextColor(0);

    this.characters.forEach(element => {
      if (element._id === id) {
        if (element.garante.titular != null) {
          doc.text(
            "Apellido y Nombre: " +
              element.garante.titular.apellidos +
              ", " +
              element.garante.titular.nombres,
            20,
            135
          );
          doc.text(
            "Fecha de Nacimiento: " +
              moment(element.garante.titular.fechaNacimiento).format(
                "DD-MM-YYYY"
              ),
            20,
            140
          );
          doc.text("D.N.I.: " + element.garante.titular.dni, 130, 140);
          if (element.garante.titular.domicilio != null) {
            doc.text(
              "Calle: " + element.garante.titular.domicilio.calle,
              20,
              145
            );
            doc.text(
              "Localidad: " + element.garante.titular.domicilio.localidad,
              20,
              150
            );
            doc.text(
              "Provincia: " + element.garante.titular.domicilio.provincia,
              130,
              150
            );

            doc.text("Celular: ", 20, 155);
            doc.text("T. Fijo:", 80, 155);
            doc.text("Mail:  ", 130, 155);
          } else {
            doc.text("Calle: ", 20, 145);
            doc.text("Localidad: ", 20, 150);
            doc.text("Provincia: ", 130, 150);

            doc.text("Celular: ", 20, 155);
            doc.text("T. Fijo:", 80, 155);
            doc.text("Mail:  ", 130, 155);
          }
        }
      }
    });

    doc.setFontSize(12);
    doc.setFillColor(52, 152, 219);
    doc.roundedRect(10, 160, 182, 8, 3, 3, "FD");

    doc.setTextColor(255);
    doc.text("Plan de Pago", 100, 165, "center");

    doc.setFontSize(10);
    doc.setTextColor(0);

    this.characters.forEach(element => {
      if (element._id === id) {
        // doc.text('Monto Solicitado: ' + element.montoPedido, 20, 175);
        let m = Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS"
        }).format(+element.montoPedido);
        doc.text("Monto Solicitado: " + m, 20, 175);
        doc.text("Cantidad de Cuotas: " + element.cantidadCuotas, 80, 175);
        doc.text("Plan: " + element.planPagos.tipoPlan.nombre, 150, 175); // plan
        //aqui iba tipo de plan que no existe en credito
      }
    });

    this.getData("CuerpoPlanPago", id);


    doc.addPage();

    doc.setFontSize(10);
    // tslint:disable-next-line:max-line-length
    doc.text(
      "         ----------------------------------------------------------------------------------------------------------------------------------------",
      10,
      25
    );


    doc.setFontSize(14);
    doc.text(" PAGARÉ:", 20, 35);
    doc.setFontSize(10);
    doc.text(
      "Pagaré sin protesto [art. 50 D. Ley 5965 / 53] a Sur Créditos o a su orden la cantidad de pesos ",
      20,
      45
    );
    doc.setFontSize(10);

    doc.text(
      " -----------  " + this.toText(this.cantidadTotal) + "  ----------- ",
      60,
      55
    );
    doc.setFontSize(10);
    doc.text(
      "Por igual valor recibido en efectivo a mi entera satisfaccion pagadero segun detalle de cuotas.-",
      20,
      65
    );
    doc.text(".................................................... ", 115, 95);
    doc.text("Firmante (Lugar y fecha): ", 120, 105);

    this.carroIndividual = 50;
    this.cantidadTotal = 0;

    doc.addPage();



    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle("normal");
    // const imgData = new Image();
    // tslint:disable-next-line:max-line-length
    // imgData.src = 'https://npclhg.dm.files.1drv.com/y4m9GX1-ImqUAw21oHBc1AU0cXj8xJb_B4EW3Omo1lOtFGEwYTmTagcQHp6Zn7AjSsa84JUu_H2bNDa_rY8Ubsl2hkNV4xk5zmWlUaN2tz_0i1q39QOAfWe_FLpR-Jfg_J94rvvQpLHLNw5_aT2hWdWRsBclGuCgF9U1i5taliO9DWw7sc4EnxfgcWT_WamOy60jkpOdDzEQIINslKGINAR6A?width=558&height=299&cropmode=none' ;
    // doc.addImage(imgData, 50, 50);
    doc.text("SUR Créditos", 20, 15);
    doc.setFontSize(7);
    doc.text("CREDITOS PARA COMERCIANTES", 20, 18);
    doc.setFontSize(10);
    doc.text("Fecha: " + moment(today).format("DD-MM-YYYY"), 130, 25);
    this.characters.forEach(x => {
      if (x._id === id) {
        this.crearNumeroFactura(x.legajo_prefijo, x.legajo);
        doc.text("Legajo Nº:  " + this.numeroFactura, 130, 30);
        doc.text("Estado: " + x.estado.nombre, 130, 35);
      }
    });


    doc.setFontSize(12);

    doc.setTextColor(0);
    doc.text("Detalle de cuotas", 20, 40);

    doc.autoTable({
      head: this.getData("CabeceraPlanPago"),
      body: this.getData("CuerpoPlanPago", id),

      margin: {
        top: 50
      }
    });

    // TODO: agregar esta apertura de pestaña a todos los cruds
    doc.save("credito.pdf");
    let pdfImprimir = doc.output("blob"); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador
    // doc.save('credito.pdf'); // Obliga a guardar el documento

    this.carroIndividual = 50;
    this.cantidadTotal = 0;
  }

  getData(tipo: string, id: string = null, dni: string = null): Array<any> {
    const dataArray = Array<any>();

    switch (tipo) {
      case "cabecera": {
        dataArray.push({
          razonSocial: "Razon Social",

          montoPedido: "Monto Pedido",
          cantidadCuotas: "Cant. Cuotas",
          valorCuota: "Valor de Cuota",
          montoInteres: "Interes",
          tieneCobranzaADomicilio: "Cobranza a Domicilio",
          montoCobranzaADomicilio: "Monto Cobranza Domicilio",
          estado: "Estado Credito"
        });
        this.lineaDeCarro = this.lineaDeCarro + 10;
        break;
      }
      case "cuerpo": {
        this.characters.forEach(element => {
          this.lineaDeCarro = this.lineaDeCarro + 10;
          dataArray.push({
            razonSocial: element.comercio.razonSocial,

            montoPedido: element.montoPedido,
            cantidadCuotas: element.cantidadCuotas,

            valorCuota: new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS"
            })
              .format(Number(element.valorCuota))
              .toString(),
            montoInteres: element.montoInteres,
            tieneCobranzaADomicilio: element.tieneCobranzaADomicilio,
            montoCobranzaADomicilio: element.montoCobranzaADomicilio,
            estado: element.estado.nombre
          });
        });
        break;
      }
      case "CabeceraPlanPago": {
        dataArray.push({
          orden: "Cuota",

          montoCapital: "Capital",
          fechaVencimiento: "Vencimiento",
          montoInteres: "Interes",
          montoCobranzaADomicilio: "CAdic. cobro Domic.",
          montoTotalCuota: "Total Cuota"
        });
        break;
      }
      case "CuerpoPlanPago": {
        this.characters.forEach(element => {
          if (element._id === id) {
            element.planPagos.cuotas.forEach(p => {
              this.carroIndividual = this.carroIndividual + 10;

              dataArray.push({
                orden: p.orden,
                montoCapital: new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS"
                })
                  .format(Number(p.montoCapital))
                  .toString(),
                fechaVencimiento: moment(p.fechaVencimiento).format(
                  "DD-MM-YYYY"
                ),
                montoInteres: new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS"
                })
                  .format(Number(p.montoInteres))
                  .toString(),
                montoCobranzaADomicilio: new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS"
                })
                  .format(Number(p.montoCobranzaADomicilio))
                  .toString(),
                montoTotalCuota: new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS"
                })
                  .format(Number(p.MontoTotalCuota))
                  .toString()
              });
              let numeroString = (+p.MontoTotalCuota).toFixed(2);
              // console.log(numeroString);
              this.cantidadTotal = this.cantidadTotal + +numeroString; //+ se usa para convertir
            });
            dataArray.push({
              orden: " ",
              montoCapital: " ",
              fechaVencimiento: " ",
              montoInteres: " ",
              montoCobranzaADomicilio: " Total",
              montoTotalCuota: new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS"
              })
                .format(Number(this.cantidadTotal))
                .toString()
            });
            this.carroIndividual = this.carroIndividual + 5;
            // console.log(this.carroIndividual);
          }
        });
      }
      case "filtro": {
        this.characters.forEach(element => {
          if (element._id === id) {
            dataArray.push({
              id: element._id
            });
          }
        });
        break;
      }
      default:
        // console.log('Invalid choice');
        break;
    }

    return dataArray;
  }

  getString(valor: boolean): string {
    if (valor === true) {
      return "SI";
    } else {
      return "NO";
    }
  }

  private toText(numero: number): string {
    //var entero = Convert.ToInt64(Math.Truncate(value1));
    //double value = Convert.ToDouble(entero);
    let Num2Text: string = "";
    let value = Math.trunc(numero);

    if (value == 0) Num2Text = "CERO";
    else if (value == 1) Num2Text = "UNO";
    else if (value == 2) Num2Text = "DOS";
    else if (value == 3) Num2Text = "TRES";
    else if (value == 4) Num2Text = "CUATRO";
    else if (value == 5) Num2Text = "CINCO";
    else if (value == 6) Num2Text = "SEIS";
    else if (value == 7) Num2Text = "SIETE";
    else if (value == 8) Num2Text = "OCHO";
    else if (value == 9) Num2Text = "NUEVE";
    else if (value == 10) Num2Text = "DIEZ";
    else if (value == 11) Num2Text = "ONCE";
    else if (value == 12) Num2Text = "DOCE";
    else if (value == 13) Num2Text = "TRECE";
    else if (value == 14) Num2Text = "CATORCE";
    else if (value == 15) Num2Text = "QUINCE";
    else if (value < 20) Num2Text = "DIECI" + this.toText(value - 10);
    else if (value == 20) Num2Text = "VEINTE";
    else if (value < 30) Num2Text = "VEINTI" + this.toText(value - 20);
    else if (value == 30) Num2Text = "TREINTA";
    else if (value == 40) Num2Text = "CUARENTA";
    else if (value == 50) Num2Text = "CINCUENTA";
    else if (value == 60) Num2Text = "SESENTA";
    else if (value == 70) Num2Text = "SETENTA";
    else if (value == 80) Num2Text = "OCHENTA";
    else if (value == 90) Num2Text = "NOVENTA";
    else if (value < 100)
      Num2Text =
        this.toText(Math.trunc(value / 10) * 10) +
        " Y " +
        this.toText(value % 10);
    else if (value == 100) Num2Text = "CIEN";
    else if (value < 200) Num2Text = "CIENTO " + this.toText(value - 100);
    else if (
      value == 200 ||
      value == 300 ||
      value == 400 ||
      value == 600 ||
      value == 800
    )
      Num2Text = this.toText(Math.trunc(value / 100)) + "CIENTOS";
    else if (value == 500) Num2Text = "QUINIENTOS";
    else if (value == 700) Num2Text = "SETECIENTOS";
    else if (value == 900) Num2Text = "NOVECIENTOS";
    else if (value < 1000)
      Num2Text =
        this.toText(Math.trunc(value / 100) * 100) +
        " " +
        this.toText(value % 100);
    else if (value == 1000) Num2Text = "MIL";
    else if (value < 2000) Num2Text = "MIL " + this.toText(value % 1000);
    else if (value < 1000000) {
      Num2Text = this.toText(Math.trunc(value / 1000)) + " MIL";
      if (value % 1000 > 0)
        Num2Text = Num2Text + " " + this.toText(value % 1000);
    } else if (value == 1000000) Num2Text = "UN MILLON";
    else if (value < 2000000)
      Num2Text = "UN MILLON " + this.toText(value % 1000000);
    else if (value < 1000000000000) {
      Num2Text = this.toText(Math.trunc(value / 1000000)) + " MILLONES ";
      if (value - Math.trunc(value / 1000000) * 1000000 > 0)
        Num2Text =
          Num2Text +
          " " +
          this.toText(value - Math.trunc(value / 1000000) * 1000000);
    } else if (value == 1000000000000) Num2Text = "UN BILLON";
    else if (value < 2000000000000)
      Num2Text =
        "UN BILLON " +
        this.toText(value - Math.trunc(value / 1000000000000) * 1000000000000);
    else {
      Num2Text = this.toText(Math.trunc(value / 1000000000000)) + " BILLONES";
      if (value - Math.trunc(value / 1000000000000) * 1000000000000 > 0)
        Num2Text =
          Num2Text +
          " " +
          this.toText(
            value - Math.trunc(value / 1000000000000) * 1000000000000
          );
    }
    return Num2Text;
  }

  crearNumeroFactura(legajo_prefijo: string, legajo: string): string {
    let s = +legajo + "";
    //console.log(s);
    while (s.length < 6) {
      s = "0" + s;
      //console.log(s);
    }
    this.numeroFactura = legajo_prefijo + "-" + s;

    return this.numeroFactura;
  }
}
