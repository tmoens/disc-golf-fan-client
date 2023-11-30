import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FanComponent} from './fan/fan.component';
import {LiveScoresComponent} from './live-scores/live-scores.component';
import {RegisterComponent} from './auth/register/register.component';
import {EmailConfirmComponent} from './auth/email-confirm/email-confirm.component';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome-page', pathMatch: 'full' },
  { path: 'manage-favourites', component: FanComponent },
  { path: 'live-scores', component: LiveScoresComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-email', component: EmailConfirmComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'welcome-page', component: WelcomePageComponent },
  { path: '**', redirectTo: 'welcome-page' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

