export class AddFavouriteDto {
  public playerId!: string;
  public fanId!: number;
  public order? = 1;
  public nickname?: string | null;
}
