import {effect, Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {of, Subscription, timer} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {plainToInstance} from 'class-transformer';
import {LoaderService} from '../loader.service';
import {ScorelineDto} from './scoreline.dto';
import {AppStateService} from '../app-state.service';
import {BriefPlayerResultDto} from './brief-player-result.dto';
import {environment} from '../../environments/environment';
import {FanService} from '../fan/fan.service';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';

/**
 * Manages live scores:
 * - Polls favourite players' live scores while the Live Scores tool is active.
 * - Polls detailed scores for the focused favourite while its panel is open.
 * Uses Angular signals for state and an effect to start/stop polling based on the active tool.
 */
@Injectable({
  providedIn: 'root'
})
export class LiveScoresService implements OnDestroy {
  detailLiveRoundId: number | null = null;
  detailResultId: number | null = null;

  // Keep signals private; expose read accessors so consumers can’t mutate
  // Public read-only views for templates/components
  private favouriteLiveScoresSig: WritableSignal<BriefPlayerResultDto[]> = signal<BriefPlayerResultDto[]>([]);
  public favouriteLiveScores = this.favouriteLiveScoresSig.asReadonly();

  private detailedScoresSig: WritableSignal<ScorelineDto | null> = signal<ScorelineDto | null>(null);
  public detailedScores = this.detailedScoresSig.asReadonly();

  favouritesLiveScoresSubscription: Subscription | null = null;
  detailedScoresSubscription: Subscription | null = null;

  constructor(
    private loaderService: LoaderService,
    private fanService: FanService,
    private appStateService: AppStateService,
  ) {
    effect(() => {
      const fan = this.fanService.fanSignal();
      const activeTool = this.appStateService.activeTool();

      // User is not logged in or no fan loaded
      if (!fan) {
        this.stopLiveScoresPolling();
        this.favouriteLiveScoresSig.set([]);
        return;
      }

      // No favourites → no polling, clear UI
      if (fan.favourites.length === 0) {
        this.stopLiveScoresPolling();
        this.favouriteLiveScoresSig.set([]);
        return;
      }

      // Active tool is NOT live scores → stop polling
      if (!activeTool || !activeTool.is(DGF_TOOL_KEY.LIVE_SCORES)) {
        this.stopLiveScoresPolling();
        return;
      }

      // Active tool is live scores, and fan has favourites
      // → load now AND start polling
      this.startLiveScoresPolling();
    });
  }

  private stopAllPolling() {
    this.stopLiveScoresPolling();
    this.stopDetailedScoresPolling();
  }

  /**
   * Starts polling a fan's favourite players live scores at the configured cadence.
   * Ensures only one polling subscription is active.
   */
  startLiveScoresPolling() {
    this.stopLiveScoresPolling();
    this.favouritesLiveScoresSubscription =
      timer(0, environment.polling.liveScoresMs).subscribe(() => {
        this.loadFavouritesLiveScores();
      });
  }

  /**
   * Stops polling live scores.
   */
  stopLiveScoresPolling() {
    if (this.favouritesLiveScoresSubscription) {
      this.favouritesLiveScoresSubscription.unsubscribe();
      this.favouritesLiveScoresSubscription = null;
    }
  }


  /**
   * This loads a fan's favourite players live scores once.
   * Clears state if no authenticated user is found.
   */
  loadFavouritesLiveScores() {
    const fan = this.fanService.fanSignal();
    if (!fan) {
      this.favouriteLiveScoresSig.set([]);
      return;
    }

    this.loaderService.getScoresForFan(fan.id).pipe(
      catchError(err => {
        console.warn('Failed to load favourites live scores', err);
        return of(null);
      })
    ).subscribe((data) => {
      if (!data) return;
      const favouritesLiveScores = data.map(d => plainToInstance(BriefPlayerResultDto, d));
      this.favouriteLiveScoresSig.set(favouritesLiveScores);
    });
  }

  /**
   * Focuses detailed polling on a specific favourite's live round.
   * Clears previous details immediately to avoid showing stale data.
   */
  setDetailFocus(briefPlayerResult?: BriefPlayerResultDto) {
    if (!briefPlayerResult) {
      this.unsetDetailFocus();
      return;
    }
    if (this.isInFocus(briefPlayerResult)) {
      return;
    }
    this.detailLiveRoundId = briefPlayerResult.liveRoundId;
    this.detailResultId = briefPlayerResult.resultId;
    this.detailedScoresSig.set(null);
    this.startDetailedScoresPolling();
  }

  /**
   * Clears detail focus and stops detailed polling.
   */
  unsetDetailFocus() {
    this.stopDetailedScoresPolling();
    this.detailLiveRoundId = null;
    this.detailResultId = null;
  }

  /**
   * Starts polling detailed scores for the current focus at the configured cadence.
   * Ensures only one detailed polling subscription is active.
   */
  startDetailedScoresPolling() {
    this.stopDetailedScoresPolling();
    this.detailedScoresSubscription =
      timer(0, environment.polling.detailedScoresMs).subscribe(() => {
        this.getDetailedScores();
      });
  }

  /**
   * Stops detailed polling and clears current detailed scores.
   */
  stopDetailedScoresPolling() {
    this.detailedScoresSig.set(null);
    if (this.detailedScoresSubscription) {
      this.detailedScoresSubscription.unsubscribe();
      this.detailedScoresSubscription = null;
    }
  }

  /**
   * Loads the current focused favourite's detailed scores once.
   * Stops polling if focus is not set.
   */
  getDetailedScores() {
    if (!this.detailLiveRoundId || !this.detailResultId) {
      this.stopDetailedScoresPolling();
      return;
    }
    this.loaderService.getDetailedScores(this.detailLiveRoundId, this.detailResultId).pipe(
      catchError(err => {
        console.warn('Failed to load detailed scores', err);
        return of(null);
      })
    ).subscribe((result) => {
      if (result) {
        this.detailedScoresSig.set(result);
      }
    });
  }

  isInFocus(briefPlayerResult: BriefPlayerResultDto): boolean {
    return (
      this.detailLiveRoundId === briefPlayerResult.liveRoundId &&
      this.detailResultId === briefPlayerResult.resultId);
  }

  ngOnDestroy() {
    this.stopAllPolling();
  }
}
