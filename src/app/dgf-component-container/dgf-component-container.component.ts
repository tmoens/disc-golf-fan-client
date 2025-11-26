import { Component } from '@angular/core';

@Component({
  selector: 'dgf-component-container',
  standalone: true,
  imports: [],
  template: `
    <div class="container">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./dgf-component-container.component.scss'],
})
export class DgfComponentContainerComponent {}
