import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

// Datatable
import { DataTablesModule } from 'angular-datatables';
import { Ng2SmartTableModule } from 'ng2-smart-table';

// Formularios Reactivos Module
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Componentes propios
import { AppheaderComponent } from './components/layout/appheader/appheader.component';
import { AppfooterComponent } from './components/layout/appfooter/appfooter.component';
import { AppmenuComponent } from './components/layout/appmenu/appmenu.component';
import { AppsettingsComponent } from './components/layout/appsettings/appsettings.component';
import { CrudUsuariosComponent } from './components/usuarios/crud-usuarios/crud-usuarios.component';
import { FormUsuarioComponent } from './components/usuarios/form-usuario/form-usuario.component';

// ngbmodule con bootstrap para tabset del formulario
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Rutas
import { Routes, RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';

// Modulos Propios
import { ServiciosModule } from './modules/servicios/servicios.module';
import { CrudClientesComponent } from './components/clientes/crud-clientes/crud-clientes.component';
import { FormClienteComponent } from './components/clientes/form-cliente/form-cliente.component';
import { CrudCreditosComponent } from './components/creditos/crud-creditos/crud-creditos.component';
import { FormCreditoComponent } from './components/creditos/form-credito/form-credito.component';
import { LoginComponent } from './components/login/login.component';
import { InfoComponent } from './components/info/info.component';

// Guards
import { LoginGuard } from './login.guard';
import { NoLoginGuard } from './no-login.guard';
import { FormViewEditUsuarioComponent } from './components/usuarios/form-view-edit-usuario/form-view-edit-usuario.component';
import { FormCambioClaveComponent } from './components/usuarios/form-cambio-clave/form-cambio-clave.component';

import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { ModalClienteComponent } from './components/creditos/modal-cliente/modal-cliente.component';
import { CrudCreditosAdminComponent } from './components/creditos/crud-creditos-admin/crud-creditos-admin.component';
import { ModalComercioComponent } from './components/creditos/modal-comercio/modal-comercio.component';
import { ViewCreditoComponent } from './components/creditos/view-credito/view-credito.component';
import { FormOrdenDePagoComponent } from './components/orden-de-pago/form-orden-de-pago/form-orden-de-pago.component';
import { CrudCreditosAdminTodosComponent } from './components/creditos/crud-creditos-admin-todos/crud-creditos-admin-todos.component';
import { CuotasComponent } from './components/cuotas/cuotas.component';
import { ModalCuotasComponent } from './components/cuotas/modal-cuotas/modal-cuotas.component';
import { SimuladorComponent } from './components/cuotas/modalCuotasSimuladas/simulador/simulador.component';
import { CuponDePagoComponent } from './components/cupon-de-pago/cupon-de-pago.component';
import { SeleccionDeClienteComponent } from './components/cupon-de-pago/seleccion-de-cliente/seleccion-de-cliente.component';
import { ElegirCuotasComponent } from './components/cupon-de-pago/elegir-cuotas/elegir-cuotas.component';
import { ModalCuotasCobranzaComponent } from './components/cupon-de-pago/modal-cuotas-cobranza/modal-cuotas-cobranza.component';
import { RendicionDeNominaComponent } from './components/rendicion-de-nomina/rendicion-de-nomina.component';
import { IngresoEgresoComponent } from './components/ingreso-egreso/ingreso-egreso.component';
import { OpertativosComponent } from './components/reportes/opertativos/opertativos.component';
import { FinancierosComponent } from './components/reportes/financieros/financieros.component';
// import { CajaComponent } from './components/reportes/caja/caja.component';
import { AbrirCajaComponent } from './components/caja/abrir-caja/abrir-caja.component';
import { CerrarCajaComponent } from './components/caja/cerrar-caja/cerrar-caja.component';
import { ReporteCreditos } from './components/reportes/reporteOperativos/reporteCreditos/reporteCreditos.component';
import { ReporteClientes } from './components/reportes/reporteOperativos/reporteClientes/reporteClientes.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReportePlanes } from './components/reportes/reporteOperativos/reportePlanes/reportePlanes.component';
import { ConfiguracionesComponent } from './components/configuraciones/configuraciones.component';
import { RendicionesPendientesComponent } from './components/rendiciones-pendientes/rendiciones-pendientes.component';
import { CreditosHistorialComponent } from './components/creditos-historial/creditos-historial.component';
import { ReporteCaja } from './components/reportes/caja/reporteCaja/reporteCaja.component';
import { ModelCajaComponent } from './components/reportes/caja/reporteCaja/model-caja/model-caja.component';
import { ViewClienteComponent } from './components/clientes/view-cliente/view-cliente.component';
import { ReportePlanesAtrasadosComponent } from './components/reportes/reporteOperativos/reporte-planes-atrasados/reporte-planes-atrasados.component';
import { PlanesdepagoComponent } from './components/configuraciones/planesdepago/planesdepago.component';
import { ModificarPlanComponent } from './components/configuraciones/planesdepago/modificar-plan/modificar-plan.component';



@NgModule({
  declarations: [
    AppComponent,
    AppheaderComponent,
    AppfooterComponent,
    AppmenuComponent,
    AppsettingsComponent,
    CrudUsuariosComponent,
    FormUsuarioComponent,
    CrudClientesComponent,
    FormClienteComponent,
    CrudCreditosComponent,
    FormCreditoComponent,
    LoginComponent,
    InfoComponent,
    FormViewEditUsuarioComponent,
    FormCambioClaveComponent,
    ModalClienteComponent,
    CrudCreditosAdminComponent,
    ModalComercioComponent,
    ViewCreditoComponent,
    FormOrdenDePagoComponent,
    CrudCreditosAdminTodosComponent,
    CuotasComponent,
    ModalCuotasComponent,
    SimuladorComponent,
    CuponDePagoComponent,
    SeleccionDeClienteComponent,
    ElegirCuotasComponent,
    ModalCuotasCobranzaComponent,
    RendicionDeNominaComponent,
    IngresoEgresoComponent,
    OpertativosComponent,
    FinancierosComponent,
    // CajaComponent,
    AbrirCajaComponent,
    CerrarCajaComponent,
    ReporteCreditos,
    ReporteClientes,
    ReportePlanes,
    ConfiguracionesComponent,
    RendicionesPendientesComponent,
    CreditosHistorialComponent,
    ReporteCaja,
    ModelCajaComponent,
    ViewClienteComponent,
    ReportePlanesAtrasadosComponent,
    PlanesdepagoComponent,
    ModificarPlanComponent
  ],
  imports: [

    BrowserModule,
    HttpClientModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ServiciosModule, // es mi modulo donde tengo servicios propios
    NgbModule,
    NgbModule.forRoot(),
    Ng2SmartTableModule,
    NgxSmartModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    LoginGuard,
    NoLoginGuard,
    NgxSmartModalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
