import { Component, Input } from '@angular/core';

@Component({
  selector: 'dgf-action-row',
  standalone: true,
  template: `
    <div
      class="dgf-action-row"
      [class.start]="align === 'start'"
      [class.end]="align === 'end'"
      [class.spaceBetween]="align === 'space-between'"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .dgf-action-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 20px;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    /* Variants */
    .dgf-action-row.start {
      justify-content: flex-start;
    }

    .dgf-action-row.spaceBetween {
      justify-content: space-between;
    }
  `],
})
export class DgfActionRowComponent {
  @Input() align: 'start' | 'end' | 'space-between' = 'end';
}
