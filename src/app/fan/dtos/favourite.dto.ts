import {Expose} from 'class-transformer';

export class FavouriteDto {
  @Expose() public playerId!: number;
  @Expose() public fanId!: string;
  @Expose() public order!: number;
  @Expose() public playerName!: string;
  @Expose() public nickname!: string | null;

  get name(): string {
    return (this.nickname) ? this.nickname : this.playerName;
  }
}
