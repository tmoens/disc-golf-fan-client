import {Expose} from 'class-transformer';

export class FavouriteDto {
public playerId!: number;
public fanId!: string;
public order!: number;
public playerName!: string;
public nickname!: string | null;

  get name(): string {
    return (this.nickname) ? this.nickname : this.playerName;
  }
}
