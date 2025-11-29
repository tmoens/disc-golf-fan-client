import { Component, effect, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DgfActionRowComponent } from '../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import {FanService} from '../../fan/fan.service';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { DGF_TOOL_ROUTES } from '../../tools/dgf-tool-routes';
import { FlattenedScoreRow, flattenFavouriteScores } from '../score/dtos/flattened-scores-for-fan.dto';
import { ScoreComponent } from '../score/score.component';
import {
  ScoresForFavouritePlayerDto,
} from '../score/dtos/scores-for-fan.dto';
import {LiveScoresService} from '../live-scores.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {DgfToolsService} from '../../tools/dgf-tools.service';
import {DgfTool} from '../../tools/dgf-tool';
import {DGF_TOOL_KEY} from '../../tools/dgf-took-keys';

@Component({
  selector: 'app-live-scores',
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ScoreComponent,
    DgfComponentContainerComponent,
    DgfActionRowComponent,
    CdkDropList,
  ],
  templateUrl: './live-scores.component.html',
  styleUrl: './live-scores.component.scss'
})

export class LiveScoresComponent implements OnInit {
  flattenedRows: FlattenedScoreRow[] = [];
  manageFavouritesTool?: DgfTool;
  private roundsInFocus = new Map<string, RoundFocusState>();

  constructor(
    protected fanService: FanService,
    protected liveScoreService: LiveScoresService,
    private toolsService: DgfToolsService,
    private router: Router,
  ) {
    effect(() => {
      const fan = this.fanService.fanSignal();

      // still logging in? still loading? do nothing
      if (!fan) return;

      // no favourites yet? → redirect
      if (fan.favourites.length === 0) {
        void router.navigate([DGF_TOOL_ROUTES.MANAGE_FAVOURITES]);
        return;
      }
    });

    effect(() => {
      const scores: ScoresForFavouritePlayerDto[] = this.liveScoreService.favouriteLiveScores();
      if (!scores)  {
        this.flattenedRows = [];
        return;
      }
      this.flattenedRows = flattenFavouriteScores(scores);
      this.updateRoundsInFocus(scores);
    });

  }

  ngOnInit() {
    this.manageFavouritesTool = this.toolsService.getByKey(DGF_TOOL_KEY.MANAGE_FAVOURITES);
  }


  updateRoundsInFocus(scores: ScoresForFavouritePlayerDto[]) {
    scores.forEach(favourite => {
      favourite.tournaments.forEach(tournament => {
        tournament.divisions.forEach(division => {
          if (division.rounds.length === 0) return;
          const latestRoundNumber = division.rounds[division.rounds.length -1].roundNumber;

          const key = `${favourite.playerId}_${tournament.tournamentId}_${division.divisionName}`;
          const currentState = this.roundsInFocus.get(key);

          if (!currentState) {
            // When initializing to set the user's focus on the favourite's latest round in the tournament.
            this.roundsInFocus.set(key, {
              roundNumber: latestRoundNumber,
              isTrackingLatest: true
            });
          } else {

            // Later on, if a new round shows up and the user is watching the latest round, switch the
            // user's focus to the new round.
            if (!currentState.isTrackingLatest) {
              if (currentState.roundNumber !== latestRoundNumber) {
                this.roundsInFocus.set(key, {
                  roundNumber: latestRoundNumber,
                  isTrackingLatest: true
                });
              }
            }
          }
        });
      });
    });
  }

  onManageFavourites() {
    void this.router.navigate([DGF_TOOL_ROUTES.MANAGE_FAVOURITES]);
  }


  onDrop(event: CdkDragDrop<FlattenedScoreRow[]>) {
    const from = this.flattenedRows[event.previousIndex];
    const to   = this.flattenedRows[event.currentIndex];

    if (!from || !to || event.previousIndex === event.currentIndex) return;

    const movedPlayerId  = from.favourite.playerId;
    const targetPlayerId = to.favourite.playerId;
    if (movedPlayerId === targetPlayerId) return;

    const direction = event.previousIndex < event.currentIndex ? 'after' : 'before';

    this.fanService.moveFavourite(movedPlayerId, targetPlayerId, direction)
      .subscribe();
  }
}



export interface RoundFocusState {
  roundNumber: number;    // The sequential number of the focused round (e.g., 1, 2, 3)
  isTrackingLatest: boolean; // Explicit flag: was the user on the "latest" round last time we checked?
}
