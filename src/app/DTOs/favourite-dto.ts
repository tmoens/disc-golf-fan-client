import {Expose} from 'class-transformer';

export class FavouriteDto {
  @Expose() public playerId!: string;
  @Expose() public fanId!: string;
  @Expose() public order!: number;
  @Expose() public playerName!: string;
  @Expose() public nickname!: string | null;
  @Expose() public updatedAt!: string;
  @Expose() public version!: number;

  get name(): string {
    return (this.nickname) ? this.nickname : this.playerName;
  }
}
