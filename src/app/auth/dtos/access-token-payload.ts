export class AccessTokenPayload {
  email!: string;
  sub?: string;
  iat?: number;
  exp!: number;
  name!: string;
}
