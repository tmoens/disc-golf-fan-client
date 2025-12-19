import {DgfToolKey} from './dgf-took-keys';
import {DgfRole} from '../auth/dgf-roles';

export type RequiredRole = 'user' | 'admin';
export type RequiredLoginState = 'loggedIn' | 'loggedOut' | 'either';

export class DgfTool {
  // Required fields
  readonly key: DgfToolKey;
  readonly displayName: string = '';
  readonly route: string = '';

  // Optional initialization parameters
  readonly description?: string;
  readonly requiredRole?: RequiredRole;
  readonly showOnMainMenu?: boolean;
  readonly requiredLoginState?: RequiredLoginState;
  readonly mainMenuOrder?: number;
  readonly icon?: string;
  readonly group?: string | null;
  readonly rawShortName?: string;

  constructor(
    key: DgfToolKey,
    init: {
      displayName: string;
      route: string;
      description?: string;
      requiredRole?: DgfRole,
      requiredLoginState?: RequiredLoginState;
      mainMenuOrder?: number;
      icon?: string;
      group?: string | null;
      rawShortName?: string;
    },
  ) {
    this.key = key;
    Object.assign(this, init);
  }

  // --- DEFAULTED GETTERS ---

  /** Default role is "user". */
  get role(): RequiredRole {
    return this.requiredRole ?? 'user';
  }

  /** Default: tool appears in main menu. */
  get show(): boolean {
    return this.showOnMainMenu ?? true;
  }

  /** Default login state: visible whether logged in or logged out. */
  get loginState(): RequiredLoginState {
    return this.requiredLoginState ?? 'either';
  }

  /** Default order value for sorting. */
  get sortOrder(): number {
    return this.mainMenuOrder ?? 0;
  }

  get shortName(): string {
    return this.rawShortName ?? this.displayName;
  }

  /** Default group is null: ungrouped. */
  get toolGroup(): string | null {
    return this.group ?? null;
  }

  is(key: DgfToolKey): boolean {
    return (key === this.key);
  }
}
