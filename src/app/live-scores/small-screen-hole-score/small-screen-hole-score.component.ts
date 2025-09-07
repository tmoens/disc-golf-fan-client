import {Component, Input, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-small-screen-hole-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './small-screen-hole-score.component.html',
  styleUrl: './small-screen-hole-score.component.scss'
})
export class SmallScreenHoleScoreComponent implements OnChanges {
  @Input() holeScore: number | undefined = 0; // 0 indicates not played.
  @Input() holePar: number | undefined = 0;

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
