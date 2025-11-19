// Why the heck did you not just put these in the configuration of the tools, Ted?
// Well, because the angular routes need this information, and it does not have
// access to the DgfToolService when routes are being built.
// So, I specify it here and use it both in the routes and in the creation of the tools.

import {DgfToolKey} from './dgf-took-keys';

export const DGF_TOOL_ROUTES: Record<DgfToolKey, string> = {
  LIVE_SCORES: 'live-scores',
  UPCOMING_EVENTS: 'upcoming-tournaments',
  MANAGE_FAVOURITES: 'manage-favourites',
  ADMIN_DASHBOARD: 'admin-dashboard',
  REGISTER: 'register',
  WELCOME: 'welcome-page',
  LOGIN: 'login',
  CONFIRM_EMAIL: 'confirm-email',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
};

export type DgfToolRouteLiteral = (typeof DGF_TOOL_ROUTES)[DgfToolKey];


