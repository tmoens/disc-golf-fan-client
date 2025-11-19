import {Injectable} from '@angular/core';

export const DGF_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type DgfRole = (typeof DGF_ROLES)[keyof typeof DGF_ROLES];

@Injectable({providedIn: 'root'})
export class UserRoleService {
  static rolePriority: Record<string, number> = {
    'admin': 300,
    'user': 200,
    'guest': 100,
  };

  constructor() {
  }

  static isAuthorized(userRole: string, permittedRole: string): boolean {
    if (!this.rolePriority.hasOwnProperty(userRole) ||
      !this.rolePriority.hasOwnProperty(permittedRole)) {
      return false;
    }

    return (this.rolePriority[userRole] >= this.rolePriority[permittedRole]);
  }
}
