import {DgfTool} from './dgf-tool';
import {Injectable} from '@angular/core';
import {DGF_TOOL_ROUTES, DgfToolRouteLiteral} from './dgf-tool-routes';
import {DGF_TOOL_KEY, DgfToolKey} from './dgf-took-keys';
import {DGF_TOOL_ROLES} from './dgf-tool-roles';

@Injectable({providedIn: 'root'})
export class DgfToolsService {
  readonly tools: Record<DgfToolKey, DgfTool>;
  readonly routeToKeyMap: Record<DgfToolRouteLiteral, DgfToolKey>;

  constructor() {
    const SYSTEM_NAME = 'Disc Golf Fan';

    this.tools = {
      LIVE_SCORES: new DgfTool(
        DGF_TOOL_KEY.LIVE_SCORES,
        {
          displayName: 'Live Scores',
          route: DGF_TOOL_ROUTES.LIVE_SCORES,
          description: 'Watch live scores for your favourite players.',
          icon: 'sync_alt',
          requiredRole: DGF_TOOL_ROLES.LIVE_SCORES,
          mainMenuOrder: 100,
        },
      ),

      UPCOMING_EVENTS: new DgfTool(
        DGF_TOOL_KEY.UPCOMING_EVENTS,
        {
          displayName: 'Upcoming Tournaments',
          route: DGF_TOOL_ROUTES.UPCOMING_EVENTS,
          description: 'When are your favourites playing next?',
          icon: 'event',
          requiredRole: DGF_TOOL_ROLES.UPCOMING_EVENTS,
          mainMenuOrder: 200,
        },
      ),

      MANAGE_FAVOURITES: new DgfTool(
        DGF_TOOL_KEY.MANAGE_FAVOURITES,
        {
          displayName: 'Manage Favorites',
          route: DGF_TOOL_ROUTES.MANAGE_FAVOURITES,
          description: 'Choose the players you want to follow.',
          icon: 'manage_accounts',
          requiredRole: DGF_TOOL_ROLES.MANAGE_FAVOURITES,
          mainMenuOrder: 300,
        },
      ),

      ADMIN_DASHBOARD: new DgfTool(
        DGF_TOOL_KEY.ADMIN_DASHBOARD,
        {
          displayName: 'Admin Dashboard',
          route: DGF_TOOL_ROUTES.ADMIN_DASHBOARD,
          description: 'Access the admin dashboard.',
          requiredRole: DGF_TOOL_ROLES.ADMIN_DASHBOARD,
          icon: 'admin_panel_settings',
          mainMenuOrder: 400,
        },
      ),

      REGISTER: new DgfTool(
        DGF_TOOL_KEY.REGISTER,
        {
          displayName: 'Registration',
          route: DGF_TOOL_ROUTES.REGISTER,
          description: `Register as a new ${SYSTEM_NAME}.`,
          requiredLoginState: 'loggedOut',
          icon: 'app_registration',
          mainMenuOrder: 500,
        },
      ),

      WELCOME: new DgfTool(
        DGF_TOOL_KEY.WELCOME,
        {
          displayName: 'Welcome',
          route: DGF_TOOL_ROUTES.WELCOME,
          description: `Introduction to ${SYSTEM_NAME}.`,
          requiredLoginState: 'either',
          icon: 'home',
          mainMenuOrder: 600,
        },
      ),

      LOGIN: new DgfTool(
        DGF_TOOL_KEY.LOGIN,
        {
          displayName: 'Sign In',
          route: DGF_TOOL_ROUTES.LOGIN,
          description: `Sign in to ${SYSTEM_NAME}.`,
          requiredLoginState: 'loggedOut',
          icon: 'login',
          mainMenuOrder: 700,
        },
      ),

      CONFIRM_EMAIL: new DgfTool(
        DGF_TOOL_KEY.CONFIRM_EMAIL,
        {
          displayName: 'Confirm Email',
          route: DGF_TOOL_ROUTES.CONFIRM_EMAIL,
          description: 'Confirm your email address.',
          icon: 'mark_email_read',
        },
      ),

      FORGOT_PASSWORD: new DgfTool(
        DGF_TOOL_KEY.FORGOT_PASSWORD,
        {
          displayName: 'Forgot Password',
          route: DGF_TOOL_ROUTES.FORGOT_PASSWORD,
          description: 'Reset link for users who forgot their password.',
          requiredLoginState: 'loggedOut',
          icon: 'lock_reset',
        },
      ),

      RESET_PASSWORD: new DgfTool(
        DGF_TOOL_KEY.RESET_PASSWORD,
        {
          displayName: 'Reset Password',
          route: DGF_TOOL_ROUTES.RESET_PASSWORD,
          description: 'Reset your password.',
          requiredLoginState: 'loggedOut',
          icon: 'lock_reset',
        },
      ),
    };


    // Auto-generate reverse lookup: route -> key
    this.routeToKeyMap = Object.fromEntries(
      (Object.entries(DGF_TOOL_ROUTES) as Array<[DgfToolKey, DgfToolRouteLiteral]>)
        .map(([key, route]) => [route, key])
    ) as Record<DgfToolRouteLiteral, DgfToolKey>;
  }

  // Convenience helpers
  getAll(): readonly DgfTool[] {
    return Object.values(this.tools);
  }


  getToolsForMainMenu(): readonly DgfTool[] {
    return Object.values(this.tools)
      .filter(tool => tool.mainMenuOrder !== undefined)
      .sort((a, b) => (a.mainMenuOrder ?? 0) - (b.mainMenuOrder ?? 0));
  }

  getByKey(key: DgfToolKey): DgfTool {
    return this.tools[key];
  }

  /** Safe reverse lookup: route literal → tool instance. */
  findToolKeyByRouteLiteral(route: DgfToolRouteLiteral): DgfToolKey | undefined {
    return this.routeToKeyMap[route];
  }
}
