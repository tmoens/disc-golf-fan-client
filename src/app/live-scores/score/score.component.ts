// tournament-score-summary.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import {
  DivisionForFanDto,
  RoundForFanDto,
  ScoresForFavouritePlayerDto,
  TournamentForFanDto,
} from '../scores-for-fan.dto';
import { ScoreDetailComponent } from './score-detail/score-detail.component';
import { ScoreSummaryComponent } from './score-summary/score-summary.component';


@Component({
  selector: 'dgf-score',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    ScoreDetailComponent,
    ScoreSummaryComponent,
    DgfComponentContainerComponent,
  ],
  templateUrl: './score.component.html',
  styles: [`
    :host {
      display: block;
      background: var(--mat-sys-surface-container-lowest);
      border-radius: 2px;
      padding: 6px;
      border: 1px solid var(--mat-sys-primary);
    }
    .score-card {
      margin: 0;
      padding: 0;
    }
  `]
})
export class ScoreComponent implements OnInit {
  @Input() player!: ScoresForFavouritePlayerDto;
  @Input() tournament!: TournamentForFanDto;
  @Input() division!: DivisionForFanDto;

  expanded = false;

  // Default: most recent round
  focusedRound: RoundForFanDto | null = null;

  ngOnInit() {
    if (this.division.rounds.length > 0) {
      const last = this.division.rounds[this.division.rounds.length - 1];
      this.focusedRound = last;
    }
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  setFocusedRound(r: RoundForFanDto) {
    this.focusedRound = r;
  }

  get isMostRecentRound(): boolean {
    return this.focusedRound?.roundNumber === this.division.rounds[this.division.rounds.length - 1].roundNumber;
  }
}
