import { Routes } from '@angular/router';
import { CrudUsuariosComponent } from './components/usuarios/crud-usuarios/crud-usuarios.component';
import { FormUsuarioComponent } from './components/usuarios/form-usuario/form-usuario.component';
import { CrudClientesComponent } from './components/clientes/crud-clientes/crud-clientes.component';
import { FormClienteComponent } from './components/clientes/form-cliente/form-cliente.component';
import { CrudCreditosComponent } from './components/creditos/crud-creditos/crud-creditos.component';
import { FormCreditoComponent } from './components/creditos/form-credito/form-credito.component';
import { LoginComponent } from './components/login/login.component';
import { InfoComponent } from './components/info/info.component';
import { LoginGuard } from './login.guard';
import { NoLoginGuard } from './no-login.guard';
import { FormViewEditUsuarioComponent } from './components/usuarios/form-view-edit-usuario/form-view-edit-usuario.component';
import { FormCambioClaveComponent } from './components/usuarios/form-cambio-clave/form-cambio-clave.component';
import { CrudCreditosAdminComponent } from './components/creditos/crud-creditos-admin/crud-creditos-admin.component';
import { ModalComercioComponent } from './components/creditos/modal-comercio/modal-comercio.component';
import { ViewCreditoComponent } from './components/creditos/view-credito/view-credito.component';
import { FormOrdenDePagoComponent } from './components/orden-de-pago/form-orden-de-pago/form-orden-de-pago.component';
import { CrudCreditosAdminTodosComponent } from './components/creditos/crud-creditos-admin-todos/crud-creditos-admin-todos.component';
import { CuotasComponent } from './components/cuotas/cuotas.component'


export const appRoutes: Routes = [
  /* { path: "usuarioedit", component: UserEditComponent },
  { path: "usuarioedit/:id", component: UserEditComponent },
  { path: "usuarioedit/:id/:firstName/:lastName", component: UserEditComponent }
 */
{ path: 'crudusuarios', component: CrudUsuariosComponent , canActivate: [LoginGuard] },
{ path: 'formusuario', component: FormUsuarioComponent , canActivate: [LoginGuard]},
{ path: 'formusuarioviewedit', component: FormViewEditUsuarioComponent , canActivate: [LoginGuard]},
{ path: 'formusuarioviewedit/:evento/:dni', component: FormViewEditUsuarioComponent, canActivate: [LoginGuard]},
{ path: 'formusuariocambioclave/:dni', component: FormCambioClaveComponent , canActivate: [LoginGuard]},
{ path: 'crudclientes', component: CrudClientesComponent , canActivate: [LoginGuard]},
{ path: 'formcliente', component: FormClienteComponent , canActivate: [LoginGuard]},
{ path: 'crudcreditos', component: CrudCreditosComponent , canActivate: [LoginGuard]},

{ path: 'formcredito', component: FormCreditoComponent , canActivate: [LoginGuard]},

{ path: 'viewcredito/:evento/:id', component: ViewCreditoComponent, canActivate:[LoginGuard]},
{ path: 'info', component: InfoComponent , canActivate: [LoginGuard]},
{ path: 'login', component: LoginComponent , canActivate: [NoLoginGuard]},
{ path: 'crudcreditosadmin', component: CrudCreditosAdminComponent , canActivate: [NoLoginGuard]},
{ path: 'crudcreditosadmintodos', component: CrudCreditosAdminTodosComponent , canActivate: [NoLoginGuard]},

{ path: 'formcomercio', component: ModalComercioComponent , canActivate: [LoginGuard]},
{ path: 'ordendepago', component: FormOrdenDePagoComponent , canActivate: [NoLoginGuard]},

{ path: '', component: LoginComponent},
/* { path: '', component: LoginComponent, canActivate: [NoLoginGuard] }, */
// si es la raiz el login, sale el component de login al iniciar el menu


];
