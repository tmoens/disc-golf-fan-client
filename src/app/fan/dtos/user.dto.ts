import {Expose} from 'class-transformer';
import 'reflect-metadata';

export class UserDto {
  @Expose() public id!: string;
  @Expose() public name!: string;
  @Expose() public email!: string;
}
