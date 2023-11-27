import {Expose} from 'class-transformer';
export class PlayerDto {
  @Expose() public id!: string;
  @Expose() public name!: string;
  @Expose() public rating!: number;
}
