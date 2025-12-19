import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { DetailedScorelineDto } from '../dtos/detailed-scoreline.dto';
import { LiveScoresService } from '../../live-scores.service';
import { RoundForFanDto, ScorelineForFanDto } from '../dtos/scores-for-fan.dto';
import { HoleScoreComponent } from '../hole-score/hole-score.component';
import { ScoreToParComponent } from '../score-vs-par/score-vs-par.component';

@Component({
  selector: 'dgf-score-detail',
  standalone: true,
  imports: [
    DecimalPipe,
    MatDivider,
    HoleScoreComponent,
    ScoreToParComponent,
  ],
  templateUrl: './score-detail.component.html',
  styleUrl: './score-detail.component.scss'
})
export class ScoreDetailComponent {
  @Input() round!: RoundForFanDto | null;
  @Input() poll = true;

  // The detailed scores being rendered.
  detailedScores: DetailedScorelineDto | undefined = undefined;

  private visible = false;
  private observer!: IntersectionObserver;
  private pollingHandle: any = null; // holds setInterval return value

  private readonly POLL_MS = 30_000;

  constructor(
    private liveScoresService: LiveScoresService,
    private elRef: ElementRef,
  ) {}

  get scoreline(): ScorelineForFanDto | null {
    return this.round?.scorelines?.[0] ?? null;
  }

  // ---------------------------------------------------------------------------
  // LIFECYCLE handling
  // ---------------------------------------------------------------------------
  ngOnInit(): void {
    if (!this.round) return;

    this.setupVisibilityObserver();

    // We do NOT start polling immediately.
    // Polling starts only when we become visible AND the round is the "live" round.
  }


  ngOnDestroy(): void {
    this.stopPolling();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['round'] && !changes['round'].firstChange) {
      this.onRoundChanged();
    }
  }

  private onRoundChanged() {
    this.stopPolling();
    if (!this.round) return;

    if (this.poll) {
      this.startPolling();
    } else {
      this.loadOnce();
    }
  }

  // ---------------------------------------------------------------------------
  // VISIBILITY HANDLING
  // ---------------------------------------------------------------------------
  private setupVisibilityObserver() {
    this.observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      const nowVisible = entry.isIntersecting;

      if (nowVisible && !this.visible) {
        this.visible = true;
        this.onBecomeVisible();
      } else if (!nowVisible && this.visible) {
        this.visible = false;
        this.onBecomeHidden();
      }
    }, {
      root: null,          // viewport
      threshold: 0.01      // basically “any part on screen”
    });

    this.observer.observe(this.elRef.nativeElement);
  }

  private onBecomeVisible() {
    if (!this.round) return;

    if (this.poll) {
      // historical round → load once
      this.loadOnce();
    } else {
      // live round → start polling
      this.startPolling();
    }
  }

  private onBecomeHidden() {
    this.stopPolling();
  }

  // ---------------------------------------------------------------------------
  // POLLING
  // ---------------------------------------------------------------------------

  private startPolling() {
    this.stopPolling(); // clear any previous polling

    if (!this.round?.liveRoundId || !this.scoreline?.resultId) return;

    // Immediate load first
    this.loadOnce();

    // Then poll
    this.pollingHandle = setInterval(() => {
      this.loadOnce();
    }, this.POLL_MS);
  }

  private stopPolling() {
    if (this.pollingHandle) {
      clearInterval(this.pollingHandle);
      this.pollingHandle = null;
    }
  }

  // ---------------------------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------------------------

  private async loadOnce() {
    if (!this.round?.liveRoundId || !this.scoreline?.resultId) return;

    const data = await this.liveScoresService.getDetailedScores(
      this.round.liveRoundId,
      this.scoreline.resultId
    );

    if (data) {
      this.detailedScores = data;
    }
  }
}
