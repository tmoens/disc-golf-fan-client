import {Component, Input, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'dgf-hole-score',
  imports: [CommonModule],
  templateUrl: './hole-score.component.html',
  styleUrl: './hole-score.component.scss'
})
export class HoleScoreComponent implements OnChanges {
  /**
   * Score achieved on this hole.
   * Undefined or 0 indicates the hole has not been played yet.
   */
  @Input() holeScore: number | undefined = 0; // 0 indicates not played.


  /**
   * Par for this hole.
   */
  @Input() holePar: number | undefined = 0;

  /**
   * scoreVsPar = holeScore - holePar
   * Used to drive UI (e.g., birdie/eagle/bogey styles).
   */
  scoreVsPar: number = 0;

  ngOnChanges() {
    this.setScoreVsPar();
  }

  setScoreVsPar(): void {
    if (!this.holeScore || !this.holePar) {
      this.scoreVsPar = 0;
    } else {
      this.scoreVsPar = this.holeScore - this.holePar;
    }
  }
}
