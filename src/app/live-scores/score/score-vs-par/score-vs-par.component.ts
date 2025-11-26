import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'dgf-score-vs-par',
  standalone: true,
  imports: [NgClass],
  template: `
    <span [ngClass]="cssClass">
      {{ displayValue }}
    </span>
  `,
  styles: [`
    .neg  { color: var(--md-sys-color-error, red); }
    .zero { color: inherit; }
    .pos  { color: inherit; }
  `]
})
export class ScoreToParComponent {
  @Input() score: number | null | undefined = null;

  get displayValue(): string {
    if (this.score == null || this.score == undefined) return '--';
    if (this.score === 0) return 'E';
    if (this.score > 0) return `+${this.score}`;
    return `${this.score}`;
  }

  get cssClass(): string {
    if (this.score == null) return '';
    if (this.score < 0) return 'neg';
    if (this.score === 0) return 'zero';
    return 'pos';
  }
}
