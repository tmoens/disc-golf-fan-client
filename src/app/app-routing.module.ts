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
import {authenticatedGuard, roleGuard} from './auth/guards/canActivateGuards';
import {AppTools} from './shared/app-tools';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {UpcomingTournamentsComponent} from './upcoming-tournaments/upcoming-tournaments.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: AppTools.WELCOME.route,
    pathMatch: 'full'
  },

  // User needs to be logged in to navigate to these
  {
    path: AppTools.MANAGE_FAVOURITES.route,
    component: FanComponent,
    canActivate: [authenticatedGuard, roleGuard],
    data: {
      permittedRole: AppTools.MANAGE_FAVOURITES.requiredRole,
    }
  },
  {
    path: AppTools.UPCOMING_EVENTS.route,
    component: UpcomingTournamentsComponent,
    canActivate: [authenticatedGuard, roleGuard],
    data: {
      permittedRole: AppTools.UPCOMING_EVENTS.requiredRole,
    }
  },
  {
    path: AppTools.LIVE_SCORES.route,
    component: LiveScoresComponent,
    canActivate: [authenticatedGuard],
    data: {
      permittedRole: AppTools.LIVE_SCORES.requiredRole,
    }
  },

  // User needs to be logged in and be an admin user to navigate to this
  {
    path: AppTools.ADMIN_DASHBOARD.route,
    component: AdminDashboardComponent,
    canActivate: [authenticatedGuard, roleGuard],
    data: {
      permittedRole: AppTools.ADMIN_DASHBOARD.requiredRole,
    }
  },

  // Any user can navigate to these any time
  // Can you log in when logged in? I guess so.
  {
    path: AppTools.REGISTER.route,
    component: RegisterComponent,
  },
  {
    path: AppTools.WELCOME.route,
    component: WelcomePageComponent,
  },
  {
    path: AppTools.LOGIN.route,
    component: LoginComponent,
  },
  {
    path: AppTools.CONFIRM_EMAIL.route,
    component: EmailConfirmComponent,
  },
  {
    path: AppTools.FORGOT_PASSWORD.route,
    component: ForgotPasswordComponent,
  },
  {
    path: AppTools.RESET_PASSWORD.route,
    component: ResetPasswordComponent,
  },
  {
    path: '**',
    component: WelcomePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
