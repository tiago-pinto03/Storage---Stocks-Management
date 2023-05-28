import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './_guard/auth.guard';
import { CreateClientComponent } from './create-client/create-client.component';
import { ClientFileComponent } from './client-file/client-file.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'createClient', component: CreateClientComponent, canActivate: [AuthGuard] },
  { path: 'clientFile', component: ClientFileComponent, canActivate: [AuthGuard] },
  {path: '**', component: HomeComponent, pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
