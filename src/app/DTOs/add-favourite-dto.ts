export class AddFavouriteDto {
  public playerId!: string;
  public fanId!: string;
  public order? = 1;
  public nickname?: string | null;
}
