import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FanComponent} from './fan/fan.component';
import {LiveScoresComponent} from './live-scores/live-scores.component';
import {RegisterComponent} from './register/register.component';
import {EmailConfirmComponent} from './email-confirm/email-confirm.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  { path: 'manage-favourites', component: FanComponent },
  { path: 'live-scores', component: LiveScoresComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-email', component: EmailConfirmComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
