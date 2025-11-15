export class ReorderFavouriteDto {
  constructor(
    public fanId: string,
    public playerIdToBeMoved: number,
    public playerIdTarget: number,
  ) {
  }
}
