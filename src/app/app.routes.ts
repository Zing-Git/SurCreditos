import { RouterModule, Routes } from '@angular/router';
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

export const appRoutes: Routes = [
  /* { path: "usuarioedit", component: UserEditComponent },
  { path: "usuarioedit/:id", component: UserEditComponent },
  { path: "usuarioedit/:id/:firstName/:lastName", component: UserEditComponent }
 */
{ path: 'crudusuarios', component: CrudUsuariosComponent , canActivate: [LoginGuard] },
{ path: 'formusuario', component: FormUsuarioComponent , canActivate: [LoginGuard]},
{ path: 'crudclientes', component: CrudClientesComponent , canActivate: [LoginGuard]},
{ path: 'formcliente', component: FormClienteComponent , canActivate: [LoginGuard]},
{ path: 'crudcreditos', component: CrudCreditosComponent , canActivate: [LoginGuard]},
{ path: 'formcredito', component: FormCreditoComponent , canActivate: [LoginGuard]},
{ path: 'info', component: InfoComponent , canActivate: [LoginGuard]},
{ path: 'login', component: LoginComponent , canActivate: [NoLoginGuard]},
// { path: '', component: LoginComponent , canActivate: [NoLoginGuard]},

];
