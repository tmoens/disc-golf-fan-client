import {Expose, Type} from 'class-transformer';
import 'reflect-metadata';
import {FavouriteDto} from './favourite-dto';

export class UserDto {
  @Expose() public id!: string;
  @Expose() public name!: string;
  @Expose() public email!: string;
}
