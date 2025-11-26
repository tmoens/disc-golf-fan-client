import {effect, Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import { firstValueFrom, of, Subscription, timer } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LoaderService} from '../loader.service';
import {DetailedScorelineDto} from './detailed-scoreline-dto';
import {AppStateService} from '../app-state.service';
import {environment} from '../../environments/environment';
import {FanService} from '../fan/fan.service';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';
import { ScoresForFavouritePlayerDto } from './scores-for-fan.dto';

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
  // Keep signals private; expose read accessors so consumers can’t mutate
  // Public read-only views for templates/components
  private favouriteLiveScoresSig: WritableSignal<ScoresForFavouritePlayerDto[]> = signal<ScoresForFavouritePlayerDto[]>([]);
  public favouriteLiveScores = this.favouriteLiveScoresSig.asReadonly();

  favouritesLiveScoresSubscription: Subscription | null = null;

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
      this.favouriteLiveScoresSig.set(data);
    });
  }

  async getDetailedScores(
    liveRoundId?: number,
    resultId?: number
  ): Promise<DetailedScorelineDto | undefined> {

    if (!liveRoundId || !resultId) {
      return undefined;
    }
    try {
      // Convert Observable → Promise and await it
      const result = await firstValueFrom(
        this.loaderService.getDetailedScores(liveRoundId, resultId).pipe(
          catchError(err => {
            console.warn('Failed to load detailed scores', err);
            return of(undefined);  // Promise resolves to undefined
          })
        )
      );
      return result ?? undefined;
    } catch (err) {
      // Normally won't get here because catchError handles it
      console.warn('Unexpected error in getDetailedScores', err);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.stopAllPolling();
  }
}
