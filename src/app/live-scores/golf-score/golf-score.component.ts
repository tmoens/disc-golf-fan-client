import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-golf-score',
    imports: [CommonModule],
    templateUrl: './golf-score.component.html',
    styleUrl: './golf-score.component.scss'
})
export class GolfScoreComponent implements OnInit{
  /**
   * Score relative to par for the round.
   * - null/undefined => show "-"
   * - 0 => show "E"
   * - negative => mark as below par
   */
  @Input() rawScore: number | null | undefined;

  scoreIsBelowPar: boolean = false;

  score: string = '';

  ngOnInit() {
    if (this.rawScore === undefined || this.rawScore === null) {
      this.score = "-";
    } else {
      this.score = (this.rawScore) ? String(this.rawScore) : 'E';
      if (this.rawScore < 0) this.scoreIsBelowPar = true;
    }
  }
}
