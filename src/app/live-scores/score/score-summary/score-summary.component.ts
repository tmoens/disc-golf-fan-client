import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { OrdinalPipe } from '../../../misc/ordinal.pipe';
import {
  DivisionForFanDto,
  RoundForFanDto, ScorelineForFanDto,
  ScoresForFavouritePlayerDto,
  TournamentForFanDto,
} from '../dtos/scores-for-fan.dto';
import { ScoreToParComponent } from '../score-vs-par/score-vs-par.component';

@Component({
  selector: 'dgf-score-summary',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    MatTooltip,
    ScoreToParComponent,
    OrdinalPipe,
  ],
  templateUrl: './score-summary.component.html',
  styleUrl: './score-summary.component.scss',
})

export class ScoreSummaryComponent {
  @Input() player!: ScoresForFavouritePlayerDto;
  @Input() tournament!: TournamentForFanDto;
  @Input() division!: DivisionForFanDto;
  @Input() round: RoundForFanDto | null = null;
  @Input() expanded = false;

  @Output() roundChanged = new EventEmitter<RoundForFanDto>();
  @Output() toggleDetail = new EventEmitter<void>();

  onRoundChange(roundNumber: number) {
    const found = this.division.rounds.find(r => r.roundNumber === roundNumber);
    if (found) this.roundChanged.emit(found);
  }

  get scoreline(): ScorelineForFanDto | null {
    return this.round?.scorelines?.[0] ?? null;
  }

  dontPropagate(event: Event) {
    event.stopPropagation();
  }
}
