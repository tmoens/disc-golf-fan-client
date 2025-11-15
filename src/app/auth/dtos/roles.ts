export const USER_ROLE = 'user';
export const ADMIN_ROLE = 'admin';

export class UserRoles {
  private static _roles: { [name: string]: number } = {
    admin: 300,
    user: 200,
  }

 static getRoles(): string[] {
    return Object.keys(this._roles);
 }

  static isAuthorized(userRole: string, permittedRole: string): boolean {
    return (this._roles[userRole] >= this._roles[permittedRole]);
  }
}
