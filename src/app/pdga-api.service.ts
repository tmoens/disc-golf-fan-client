import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, tap, Observable, catchError, lastValueFrom} from "rxjs";
import {PdgaPlayerData} from "./DTOs/pdga-player-data";

const pdgaURL = '/pdgaapi';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class PdgaApiService {
  token = '';
  sessionName = '';
  sessionId = '';

  constructor(private httpClient: HttpClient
  ) {
    this.login();
  }

  async login() {
    const username = 'tmoens';
    const password = '5YR0ieyVYpZZy82IctU48O';
    const response: any = await lastValueFrom(
      this.httpClient.post(`${pdgaURL}/user/login`, {
        username: username,
        password: password,
      }),
    );
    this.token = response.data.token;
    this.sessionId = response.data.sessid;
    this.sessionName = response.data.session_name;
    console.log(`Logging in to PDGA API: ${JSON.stringify(response.data)}`);
  }

  // async getTournamentData(
  //   tournamentId: string,
  // ): Promise<PdgaTournamentData| null> {
  //   const response = await lastValueFrom(
  //     this.httpClient.get(`${pdgaURL}/event?tournament_id=${tournamentId}`, {
  //       headers: {
  //         Cookie: `${this.sessionName}=${this.sessionId}`,
  //       },
  //     }),
  //   );
  //   console.log(`Tournament Data: ${JSON.stringify(response.data, null, 2)}`);
  //   if (
  //     response.data &&
  //     response.data.events &&
  //     response.data.events.length > 0
  //   ) {
  //     return response.data.events[0] as PdgaTournamentData;
  //   } else {
  //     return null;
  //   }
  // }

  getPlayerData(pdgaNumber: string): Observable<PdgaPlayerData | null> {
      return this.httpClient.get(`${pdgaURL}/players?pdga_number=${pdgaNumber}`, {
        headers: {
          Cookie: `${this.sessionName}=${this.sessionId}`,
        },
      })
        .pipe(
          map((response: any) => {
            if (
                response.data &&
                response.data.players &&
                response.data.players.length > 0
              ) {
                return response.data.players[0] as PdgaPlayerData;
              } else {
                return null;
              }
          }),
          tap(player =>
            console.log(player ? JSON.stringify(player) : `no luck with ${pdgaNumber}`)
          ),
        )


    // console.log(`Player Data: ${JSON.stringify(response.data)}`);
    //
    // if (
    //   response.data &&
    //   response.data.players &&
    //   response.data.players.length > 0
    // ) {
    //   return response.data.players[0] as PdgaPlayerData;
    // } else {
    //   return null;
    // }
  }

  // // retrieve all the players in a tournament.
  // // Unfortunately the pdga does not provide an API for this,
  // // So, we load the tournament web page and scrape the players out of that HTML
  // //
  // // In the tournament HTML, player elements with a pdga number are like this
  // // <td class='player'>
  // //   <a href="/player/89924" class="tooltip tooltipstered" data-tooltip-content="#player-details-89924">Ted Moens</a>
  // // </td>
  // //
  // // players elements *without* a pdga number are in an element like this
  // // <td class='player'>Maria Jacobs</td>
  // async getTournamentPlayers(tournamentId: string): Promise<PdgaPlayerMini[]> {
  //   const players: PdgaPlayerMini[] = [];
  //   const tournamentWebPage = await lastValueFrom(
  //     this.httpService.get(`https://www.pdga.com/tour/event/${tournamentId}`),
  //   );
  //
  //   const dom = new JSDOM(tournamentWebPage.data);
  //
  //   // Conveniently, all the player information is in the set of elements that
  //   // have the 'player' class, so let's grab them all with one dom query.
  //   const playerElements: HTMLElement[] =
  //     dom.window.document.getElementsByClassName('player');
  //
  //   for (const playerElement of playerElements) {
  //     const player: PdgaPlayerMini = new PdgaPlayerMini();
  //
  //     // check which case by trying to find an <a></a> selector in the element.
  //     const playerElementWithPdgaNumber = playerElement.querySelector('a');
  //
  //     if (playerElementWithPdgaNumber) {
  //       // player element has PDGA number.
  //       // See if we know the player, if not add them to our db.
  //       player.pdgaNumber = playerElementWithPdgaNumber.href.substring(8);
  //       player.name = playerElementWithPdgaNumber.text.toLowerCase();
  //     } else {
  //       // player element *does not have* a PDGA number.
  //       player.name = playerElement.textContent.toLowerCase();
  //     }
  //     players.push(player);
  //   }
  //   return players;
  // }
}

// export class PdgaPlayerMini {
//   name: string;
//   pdgaNumber: string = null;
// }
