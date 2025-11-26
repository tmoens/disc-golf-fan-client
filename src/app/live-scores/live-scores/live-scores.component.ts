import { Component, effect, OnInit, signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DgfActionRowComponent } from '../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import {FanService} from '../../fan/fan.service';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { DGF_TOOL_ROUTES } from '../../tools/dgf-tool-routes';
import { ScoreComponent } from '../score/score.component';
import {
  DivisionForFanDto,
  RoundForFanDto,
  ScoresForFavouritePlayerDto,
  TournamentForFanDto,
} from '../scores-for-fan.dto';
import {LiveScoresService} from '../live-scores.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
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
  ],
  templateUrl: './live-scores.component.html',
  styleUrl: './live-scores.component.scss'
})

export class LiveScoresComponent implements OnInit {
  manageFavouritesTool?: DgfTool;
  roundNote: number | null = null;
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
        router.navigate([DGF_TOOL_ROUTES.MANAGE_FAVOURITES]);
        return;
      }
    });

    effect(() => {
      const scores: ScoresForFavouritePlayerDto[] = this.liveScoreService.favouriteLiveScores();
      if (!scores) return;
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
    this.router.navigate([DGF_TOOL_ROUTES.MANAGE_FAVOURITES]);
  }

  async openPanel() {
    // Opening one panel automatically closes any other open panel.
    // So both (opened) and (closed) are fired.
    // BUT when a new panel is opened, and if (opened) fires first, then closed fires,
    // the effect is that the newly opened panel will close.  So...
    // Wait a tick for Close to fire first.
    // await new Promise((resolve) => setTimeout(resolve, 1));
    // this.liveScoreService.setDetailFocus(briefPlayerResult);
  }


  onDrop(event: CdkDragDrop<any>) {
    this.fanService.moveFavourite(event.previousIndex, event.currentIndex);
  }

  onShowScoreDetails(
    f: ScoresForFavouritePlayerDto,
    t: TournamentForFanDto,
    d: DivisionForFanDto,
    r: RoundForFanDto
  ) {
    this.roundNote = r.liveRoundId;
    const key = `${f.playerId}_${t.tournamentId}_${d.divisionName}`;
    this.roundsInFocus.set(key, {
      roundNumber: r.roundNumber,
      isTrackingLatest: (r === d.rounds[d.rounds.length -1])
    });
  }

  getRoundInFocus(f: ScoresForFavouritePlayerDto, t: TournamentForFanDto, d: DivisionForFanDto): number {
    const key = `${f.playerId}_${t.tournamentId}_${d.divisionName}`;
    const currentState = this.roundsInFocus.get(key);
    return currentState?.roundNumber ?? 0;
  }

  protected readonly JSON = JSON;
}



export interface RoundFocusState {
  roundNumber: number;    // The sequential number of the focused round (e.g. 1, 2, 3)
  isTrackingLatest: boolean; // Explicit flag: was the user on the "latest" round last time we checked?
}
