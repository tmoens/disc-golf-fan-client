// Why the heck did you not just put these in the configuration of the tools, Ted?
// Well, because the angular routes need this information, and it does not have
// access to the DgfToolService when routes are being built.
import {DgfToolKey} from './dgf-took-keys';
import {DGF_ROLES, DgfRole} from '../auth/dgf-roles';

export const DGF_TOOL_ROLES: Record<DgfToolKey, DgfRole | undefined> = {
  LIVE_SCORES: DGF_ROLES.USER,
  UPCOMING_EVENTS: DGF_ROLES.USER,
  MANAGE_FAVOURITES: DGF_ROLES.USER,
  ADMIN_DASHBOARD: DGF_ROLES.ADMIN,

  WELCOME: undefined,
  REGISTER: undefined,
  LOGIN: undefined,
  CONFIRM_EMAIL: undefined,
  FORGOT_PASSWORD: undefined,
  RESET_PASSWORD: undefined,
} as const;
