import {ADMIN_ROLE, USER_ROLE} from '../auth/dtos/roles';
import {AppTool} from './app-tool';

const SYSTEM_NAME = 'Disc Golf Fan';

export const AppTools = {
  LIVE_SCORES: {
    displayName: 'Live Scores',
    route: 'live-scores',
    description: 'Watch the live scores for your favourite players.',
    requiredRole: USER_ROLE,
  },

  UPCOMING_EVENTS: {
    displayName: 'Upcoming Tournaments',
    route: 'upcoming-tournaments',
    description: 'When are your favourites playing next?',
    requiredRole: USER_ROLE,
  },

  MANAGE_FAVOURITES: {
    displayName: 'Manage Favorites',
    route: 'manage-favourites',
    description: 'Choose the players you want to follow.',
    requiredRole: USER_ROLE,
  },

  ADMIN_DASHBOARD: {
    displayName: 'Admin Dashboard',
    route: 'admin-dashboard',
    description: 'Access the admin dashboard.',
    requiredRole: ADMIN_ROLE,
  },

  REGISTER: {
    displayName: 'Registration',
    route: 'register',
    description: `Register as a new ${SYSTEM_NAME}.`,
  },

  WELCOME: {
    displayName: 'Welcome',
    route: 'welcome-page',
    description: `Introduction to ${SYSTEM_NAME}.`,
  },

  LOGIN: {
    displayName: 'Sign In',
    route: 'login',
    description: `Sign in to ${SYSTEM_NAME}.`,
  },

  CONFIRM_EMAIL: {
    displayName: 'Confirm Email',
    route: 'confirm-email',
    description: 'Confirm your email address.',
  },

  FORGOT_PASSWORD: {
    displayName: 'Forgot Password',
    route: 'forgot-password',
    description: 'Reset link for users who forgot their password.',
  },

  RESET_PASSWORD: {
    displayName: 'Reset Password',
    route: 'reset-password',
    description: 'Reset your password.',
  },
} as const satisfies Readonly<Record<string, AppTool>>;

export type AppToolKey = keyof typeof AppTools;
export type ConcreteAppTool = (typeof AppTools)[AppToolKey];
export const ALL_TOOLS: readonly ConcreteAppTool[] = Object.values(AppTools);
