import { Component, OnInit } from '@angular/core';
import {Player} from "./player";
import {PLAYERS} from "./mock-players";
import {PdgaApiService} from "../pdga-api.service";

/**
 * This is the list of players the user wants to follow.
 * Ultimately they will be retrieved from a server, for now they are simply coded.
 */
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  players: Player[] = PLAYERS
  constructor(private pdgaApi: PdgaApiService) { }

  ngOnInit(): void {
    // Go to the PDGA to get player info for the players
    for(const player of this.players) {
      this.pdgaApi.getPlayerData(player.pdgaNumber).subscribe((pdgaPlayer) => {
        player.pdgaPlayerData = pdgaPlayer;
        }
      );
    }
  }



}
