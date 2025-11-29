import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FanComponent} from './fan/fan.component';
import {LiveScoresComponent} from './live-scores/live-scores/live-scores.component';
import {RegisterComponent} from './register/register.component';
import {EmailConfirmComponent} from './auth/email-confirm/email-confirm.component';
import {LoginComponent} from './auth/login/login.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import { UserAccountManagementComponent } from './user-account-management/user-account-management.component';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import {authenticatedGuard, roleGuard} from './auth/guards/canActivateGuards';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {UpcomingTournamentsComponent} from './upcoming-tournaments/upcoming-tournaments.component';
import {DGF_TOOL_ROUTES} from './tools/dgf-tool-routes';
import {DGF_TOOL_ROLES} from './tools/dgf-tool-roles';

const routes: Routes = [
  {
    path: '',
    redirectTo: DGF_TOOL_ROUTES.WELCOME,
    pathMatch: 'full'
  },

  // User needs to be logged in to navigate to these
  {
    path: DGF_TOOL_ROUTES.MANAGE_FAVOURITES,
    component: FanComponent,
    canActivate: [authenticatedGuard, roleGuard],
    data: {
      permittedRole: DGF_TOOL_ROLES.MANAGE_FAVOURITES,
    }
  },
  {
    path: DGF_TOOL_ROUTES.UPCOMING_EVENTS,
    component: UpcomingTournamentsComponent,
    canActivate: [authenticatedGuard, roleGuard],
    data: {
      permittedRole: DGF_TOOL_ROLES.UPCOMING_EVENTS,
    }
  },
  {
    path: DGF_TOOL_ROUTES.LIVE_SCORES,
    component: LiveScoresComponent,
    canActivate: [authenticatedGuard],
    data: {
      permittedRole: DGF_TOOL_ROLES.LIVE_SCORES,
    }
  },

  {
    path: DGF_TOOL_ROUTES.ADMIN_DASHBOARD,
    component: AdminDashboardComponent,
    canActivate: [authenticatedGuard, roleGuard],
    data: {
      permittedRole: DGF_TOOL_ROLES.ADMIN_DASHBOARD,
    }
  },

  {
    path: DGF_TOOL_ROUTES.USER_ACCOUNT_MANAGEMENT,
    component: UserAccountManagementComponent,
    canActivate: [authenticatedGuard, roleGuard],
    data: {
      permittedRole: DGF_TOOL_ROLES.USER_ACCOUNT_MANAGEMENT,
    }
  },

  // Any user can navigate to these any time
  // Can you log in when logged in? I guess so.
  {
    path: DGF_TOOL_ROUTES.REGISTER,
    component: RegisterComponent,
  },
  {
    path: DGF_TOOL_ROUTES.WELCOME,
    component: WelcomePageComponent,
  },
  {
    path: DGF_TOOL_ROUTES.LOGIN,
    component: LoginComponent,
  },
  {
    path: DGF_TOOL_ROUTES.LOGOUT,
    component: LoginComponent,
  },
  {
    path: DGF_TOOL_ROUTES.CONFIRM_EMAIL,
    component: EmailConfirmComponent,
  },
  {
    path: DGF_TOOL_ROUTES.FORGOT_PASSWORD,
    component: ForgotPasswordComponent,
  },
  {
    path: DGF_TOOL_ROUTES.RESET_PASSWORD,
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
