import {ADMIN_ROLE, USER_ROLE} from '../app/auth/auth-related-dtos/roles';
const SYSTEM_NAME = 'Disc Gold Fan';
export class AppTools {
  static readonly LIVE_SCORES = new AppTools(
    'Live Scores',
    'live-scores',
    `Watch the live scores for your favourite players.`,
    USER_ROLE
  );

  static readonly UPCOMING_EVENTS = new AppTools(
    'Upcoming Events',
    'upcoming-events',
    `When are your favourites playing next?.`,
    USER_ROLE
  );

  static readonly MANAGE_FAVOURITES = new AppTools(
    'Manage Favourites',
    'manage-favourites',
    `Choose the players you want to follow.`,
    USER_ROLE
  );

  static readonly ADMIN_DASHBOARD = new AppTools(
      'Admin Dashboard',
      'admin-dashboard',
      `Access the admin dashboard`,
    ADMIN_ROLE
  );

  static readonly REGISTER = new AppTools(
    'Register',
    'register',
    `Register as a new ${SYSTEM_NAME}`,
  );

  static readonly WELCOME = new AppTools(
    'Welcome',
    'welcome-page',
    `Introduction to ${SYSTEM_NAME}`,
  );

  static readonly LOGIN = new AppTools(
    'Sign In',
    'login',
    `Sign in to ${SYSTEM_NAME}`,
  );

  static readonly CONFIRM_EMAIL = new AppTools(
    'Confirm Email',
    'confirm-email',
    `Confirm your email address.`,
  );

  static readonly FORGOT_PASSWORD = new AppTools(
    'Forgot Password',
    'forgot-password',
    `Fan forgot their password.`,
  );

  static readonly RESET_PASSWORD = new AppTools(
    'Reset Password',
    'reset-password',
    `Reset your password.`,
  );

  // private to disallow creating other instances than the static ones above.
  private constructor(
    public readonly displayName: string,
    public readonly route: string,
    public readonly description: string,
    public readonly requiredRole?: string,
  ) {
  }

  // If you talk about a particular tool without specifying an attribute, you get it's route.
  toString() {
    return this.route;
  }
}

