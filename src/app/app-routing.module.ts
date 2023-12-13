import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FanComponent} from './fan/fan.component';
import {LiveScoresComponent} from './live-scores/live-scores.component';
import {RegisterComponent} from './auth/register/register.component';
import {EmailConfirmComponent} from './auth/email-confirm/email-confirm.component';
import {LoginComponent} from './auth/login/login.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import {AppTools} from './app-helpers/app-tool-types';

const routes: Routes = [
  { path: '', redirectTo: AppTools.WELCOME_PAGE, pathMatch: 'full' },
  { path: AppTools.MANAGE_FAVOURITES, component: FanComponent },
  { path: AppTools.LIVE_SCORES, component: LiveScoresComponent },
  { path: AppTools.REGISTER, component: RegisterComponent },
  { path: AppTools.CONFIRM_EMAIL, component: EmailConfirmComponent },
  { path: AppTools.LOGIN, component: LoginComponent },
  { path: AppTools.FORGOT_PASSWORD, component: ForgotPasswordComponent },
  { path: AppTools.RESET_PASSWORD, component: ResetPasswordComponent },
  { path: AppTools.WELCOME_PAGE, component: WelcomePageComponent },
  { path: '**', redirectTo: AppTools.WELCOME_PAGE },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

