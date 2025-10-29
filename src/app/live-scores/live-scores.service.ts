import {Injectable, OnDestroy, signal, WritableSignal, effect} from '@angular/core';
import {LoaderService} from '../loader.service';
import {ScorelineDto} from '../DTOs/scoreline.dto';
import {interval, Subscription, of} from 'rxjs';
import {AppStateService} from '../app-state.service';
import {AppTools} from '../shared/app-tools';
import {plainToInstance} from 'class-transformer';
import {BriefPlayerResultDto} from '../DTOs/brief-player-result.dto';
import {AuthService} from '../auth/auth.service';
import {catchError} from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  favouritesLiveScoresSubscription: Subscription | null = null;
  public favouriteLiveScores = this.favouriteLiveScoresSig.asReadonly();

  private detailedScoresSig: WritableSignal<ScorelineDto | null> = signal<ScorelineDto | null>(null);
  detailedScoresSubscription: Subscription | null = null;
  public detailedScores = this.detailedScoresSig.asReadonly();

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private appStateService: AppStateService
  ) {
    // React to active tool changes via signal effect
    effect(() => {
        const activeTool = this.appStateService.activeTool();
        if (activeTool?.route === AppTools.LIVE_SCORES.route) {
          this.startFavouritesLiveScoresPolling();
          this.startDetailedScoresPolling();
        } else {
          this.stopFavouritesLiveScoresPolling();
          this.stopDetailedScoresPolling();
        }
      },
      { allowSignalWrites: true });
  }

  /**
   * Current detailed scores (null when nothing is focused or data not loaded yet).
   */
  detailedScoresValue(): ScorelineDto | null {
    return this.detailedScoresSig();
  }

  /**
   * Starts polling favourite players' live scores at the configured cadence.
   * Ensures only one polling subscription is active.
   */
  startFavouritesLiveScoresPolling() {
    this.stopFavouritesLiveScoresPolling();
    this.loadFavouritesLiveScores();
    this.favouritesLiveScoresSubscription = interval(environment.polling.liveScoresMs).subscribe(() => {
      this.loadFavouritesLiveScores();
    });
  }

  /**
   * Stops polling favourite players' live scores.
   */
  stopFavouritesLiveScoresPolling() {
    if (this.favouritesLiveScoresSubscription) {
      this.favouritesLiveScoresSubscription.unsubscribe();
      this.favouritesLiveScoresSubscription = null;
    }
  }

  /**
   * This loads favourite players' live scores once.
   * Clears state if no authenticated user is found.
   */
  loadFavouritesLiveScores() {
    const fanId = this.authService.getAuthenticatedUserId();
    if (!fanId) {
      this.favouriteLiveScoresSig.set([]);
      return;
    }
    this.loaderService.getScoresForFan(fanId).pipe(
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
  setDetailFocus(briefPlayerResult: BriefPlayerResultDto) {
    if (!briefPlayerResult) {
      this.unsetDetailFocus();
      return;
    }
    if (this.detailLiveRoundId === briefPlayerResult.liveRoundId &&
      this.detailResultId === briefPlayerResult.resultId) {
      return;
    }
    this.detailLiveRoundId = briefPlayerResult.liveRoundId;
    this.detailResultId = briefPlayerResult.resultId;
    this.detailedScoresSig.set(null);
    this.startDetailedScoresPolling();
  }

  isInFocus(briefPlayerResult: BriefPlayerResultDto): boolean {
    const detailedScores = this.detailedScoresSig();
    return !!(
      detailedScores &&
      detailedScores.liveRoundId === briefPlayerResult.liveRoundId &&
      detailedScores.resultId === briefPlayerResult.resultId);
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
    this.getDetailedScores();
    this.detailedScoresSubscription = interval(environment.polling.detailedScoresMs).subscribe(() => {
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

  ngOnDestroy() {
    this.stopFavouritesLiveScoresPolling();
    this.stopDetailedScoresPolling();
  }
}
