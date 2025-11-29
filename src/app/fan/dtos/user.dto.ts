import {Expose} from 'class-transformer';
import 'reflect-metadata';

export class UserDto {
  public id!: string;
  public name!: string;
  public email!: string;
  public role!: string;
  public emailConfirmed!: boolean;
}
