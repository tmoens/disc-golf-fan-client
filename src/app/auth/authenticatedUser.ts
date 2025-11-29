// This is distinct from the UserDto that comes as part of the data in the FanDto.
// The Authenticated User is built from data contained in the JWT AccessToken payload.

import {UserRoleService} from './dgf-roles';

export class AuthenticatedUser {
  constructor(
    public id: string,
    public role: string,
    public email: string | null = 'unknown',
    public emailConfirmed: boolean,
  ) {
  }

  canPerformRole(role: string): boolean {
    return UserRoleService.isAuthorized(this.role, role);
  }
}
