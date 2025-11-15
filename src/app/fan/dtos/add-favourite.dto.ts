export class AddFavouriteDto {
  public playerId!: number;
  public fanId!: string;
  public order? = 1;
  public nickname?: string | null;
}
