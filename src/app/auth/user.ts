import {UserRoleService} from './dgf-roles';

export class User {
  constructor(
    public id: string,
    public role: string,
    public email: string | null = 'unknown',
  ) {
  }

  canPerformRole(role: string): boolean {
    return UserRoleService.isAuthorized(this.role, role);
  }
}
