import {Component, effect, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlayerResultDto} from '../../DTOs/player-result-dto';
import {SmallScreenHoleScoreComponent} from '../small-screen-hole-score/small-screen-hole-score.component';
import {LiveScoresService} from '../live-scores.service';

@Component({
  selector: 'app-small-screen-score-details',
  standalone: true,
  imports: [CommonModule, SmallScreenHoleScoreComponent],
  templateUrl: './small-screen-score-details.component.html',
  styleUrl: './small-screen-score-details.component.scss'
})
export class SmallScreenScoreDetails implements OnInit {
  @Input() resultId!: number;
  result: PlayerResultDto | null = null;
  holeScores: (number | null)[] = [];
  leaderHoleScores: (number | null)[] = [];


  constructor(
    private liveScoreService: LiveScoresService,
  ) {
    effect(() => {
      this.result = this.liveScoreService.activeResultSig();
      if (this.result?.resultId === this.resultId) {
        this.processResult();
      }
    });
  }

  ngOnInit() {
  }

  processResult() {
    if (this.result) {
      this.holeScores = this.result.holeScores.split(',').map(score => {
        if (score) {
          return Number(score);
        } else {
          return null;
        }
      });
      this.leaderHoleScores = this.result.leader.holeScores.split(',').map(score => {
        if (score) {
          return Number(score);
        } else {
          return null;
        }
      });
    }
  }
}
