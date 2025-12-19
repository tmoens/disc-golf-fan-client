import {Component, effect, OnDestroy} from '@angular/core';
import { AppStateService } from './app-state.service';
import {BreakpointService} from './breakpoint.service';
import {Subscription} from 'rxjs';
import {FanService} from './fan/fan.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnDestroy {
  title = 'disc-golf-fan';
  isLargeScreen: boolean = true;
  toBeDestroyedLater: Subscription;

  constructor(
    protected fanService: FanService,
    protected appState: AppStateService,
    private breakpointService: BreakpointService,
  ) {
    effect(() => {
      document.body.classList.toggle('compact', appState.screenInfo().isSmall);
    });
    this.toBeDestroyedLater = this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });
  }

  ngOnDestroy() {
    if (this.toBeDestroyedLater) {
      this.toBeDestroyedLater.unsubscribe();
    }
  }

  protected readonly JSON = JSON;
}
