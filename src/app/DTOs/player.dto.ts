import {Expose} from 'class-transformer';
export class PlayerDto {
  @Expose() public id!: number;
  @Expose() public name!: string;
  @Expose() public rating!: number;
}
