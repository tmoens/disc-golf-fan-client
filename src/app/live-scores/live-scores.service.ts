import {Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../loader.service';
import {ScorelineDto} from '../DTOs/scoreline.dto';
import {interval, Subscription} from 'rxjs';
import {AppStateService} from '../app-state.service';
import {AppTools} from '../../assets/app-tools';
import {plainToInstance} from 'class-transformer';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result.dto';
import {AuthService} from '../auth/auth.service';

// This component is responsible for polling for:
// 1 - the live scores of all the favourites (who are currently playing) for a fan
// 2 - the details of a favourite's scores that have been "expanded"

@Injectable({
  providedIn: 'root'
})
export class LiveScoresService implements OnDestroy {

  // The live scores for all the fans favourite players.
  // When a fan is logged in, we grab the scores for the fan's favourites.
  // Then we poll the server for updates.
  // The component responsible for showing the scores just shows the latest info.
  // This is an Angular Signal that will hold scores we poll from the server.
  favouriteLiveScoresSig: WritableSignal<BriefPlayerResultDto[]> = signal<BriefPlayerResultDto[]>([]);
  favouritesLiveScoresSubscription: Subscription | null = null;

  // The detailed results for a particular player includes
  // - hole by hole scores for the favourite in question
  // - hole by hole distance, pars
  // - hole by hole scores for the leader
  // - average scores per hole to this point in the round
  detailLiveRoundId: number | null = null;
  detailResultId: number | null = null;
  detailedScoresSig: WritableSignal<ScorelineDto | null> = signal<ScorelineDto | null>(null);
  detailedScoresSubscription: Subscription | null = null;

  // We watch the app state.
  // If the app is showing live scores, we should be polling the server for live score updates.
  appStateSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private appStateService: AppStateService
  ) {
    this.appStateSubscription = this.appStateService.activeTool.subscribe((activeTool: string) => {
      if (activeTool === AppTools.LIVE_SCORES.route) {
        this.startFavouritesLiveScoresPolling();
        this.startDetailedScoresPolling();
      } else {
        this.stopFavouritesLiveScoresPolling();
        this.stopDetailedScoresPolling();
      }
    })
  }

  get detailedScores(): ScorelineDto | null {
    return this.detailedScoresSig();
  }
  startFavouritesLiveScoresPolling() {
    this.stopFavouritesLiveScoresPolling(); // probably unnecessary, but harmless.
    this.loadFavouritesLiveScores();
    this.favouritesLiveScoresSubscription = interval(60000).subscribe(() => {
      this.loadFavouritesLiveScores();
    });
  }

  stopFavouritesLiveScoresPolling() {
    if (this.favouritesLiveScoresSubscription) {
      this.favouritesLiveScoresSubscription.unsubscribe();
      this.favouritesLiveScoresSubscription = null;
    }
  }

  loadFavouritesLiveScores() {
    const fanId = this.authService.getAuthenticatedUserId()
    // it should probably never happen that this is called when no one is logged in...
    if (!fanId) {
      this.favouriteLiveScoresSig.set([]);
      return;
    }
    this.loaderService.getScoresForFan(fanId).subscribe((data) => {
      const favouritesLiveScores = [];
      if (!data) return;
      // we have data
      for (const datum of data) {
        favouritesLiveScores.push(plainToInstance(BriefPlayerResultDto, datum));
      }
      this.favouriteLiveScoresSig.set(favouritesLiveScores);
    });
  }

  // Start watching details of one particular favourite's scores
  setDetailFocus(briefPlayerResult: BriefPlayerResultDto) {
    if (!briefPlayerResult) this.unsetDetailFocus();
    if (this.detailLiveRoundId === briefPlayerResult.liveRoundId && this.detailResultId === briefPlayerResult.resultId) return;
    this.detailLiveRoundId = briefPlayerResult.liveRoundId;
    this.detailResultId = briefPlayerResult.resultId;
    this.startDetailedScoresPolling();
  }

  isInFocus(briefPlayerResult: BriefPlayerResultDto): boolean {
    const detailedScores = this.detailedScoresSig();
    return !!(
      detailedScores &&
      detailedScores.liveRoundId === briefPlayerResult.liveRoundId &&
      detailedScores.resultId === briefPlayerResult.resultId);
  }

  // Stop watching details if we were.
  unsetDetailFocus() {
    this.stopDetailedScoresPolling();
    this.detailLiveRoundId = null;
    this.detailResultId = null;
  }

  startDetailedScoresPolling() {
    // In case we were watching detailed scores for a different favourite, stop.
    this.stopDetailedScoresPolling();
    this.getDetailedScores();
    this.detailedScoresSubscription = interval(60000).subscribe(() => {
      this.getDetailedScores();
    });
  }

  stopDetailedScoresPolling() {
    this.detailedScoresSig.set(null);
    if (this.detailedScoresSubscription) {
      this.detailedScoresSubscription.unsubscribe();
    }
  }

  getDetailedScores() {
    if (!this.detailLiveRoundId || !this.detailResultId) {
      this.stopDetailedScoresPolling();
    } else {
      this.loaderService.getDetailedScores(this.detailLiveRoundId, this.detailResultId).subscribe((result) => {
        if (!result) {
          this.detailedScoresSig.set(null);
        } else {
          this.detailedScoresSig.set(result);
        }
      });
    }
  }

  ngOnDestroy() {
    this.stopFavouritesLiveScoresPolling();
    this.stopDetailedScoresPolling();
    if (this.appStateSubscription) {
      this.appStateSubscription.unsubscribe();
    }
  }
}
