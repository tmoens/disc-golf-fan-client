import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {BreakpointService} from './breakpoint.service';
import {Subscription} from 'rxjs';
import {FanService} from './fan/fan.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'disc-golf-fan';
  isLargeScreen: boolean = true;
  toBeDestroyedLater: Subscription;

  constructor(
    protected fanService: FanService,
    private router: Router,
    private breakpointService: BreakpointService,
  ) {
    this.toBeDestroyedLater = this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });
  }

  ngOnDestroy() {
    if (this.toBeDestroyedLater) {
      this.toBeDestroyedLater.unsubscribe();
    }
  }
}
