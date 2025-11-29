export class AccessTokenPayload {
  emailConfirmed!: boolean;
  email!: string;
  sub!: string;
  iat?: number;
  exp!: number;
  role!: string;
}
