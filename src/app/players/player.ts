import {PdgaPlayerData} from "../DTOs/pdga-player-data";

export interface Player {
  nickname?: string;
  pdgaNumber: string;
  pdgaPlayerData?: PdgaPlayerData | null
}
