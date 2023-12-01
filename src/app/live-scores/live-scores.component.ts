import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FanService} from '../fan/fan.service';
import {MatCardModule} from '@angular/material/card';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-live-scores',
  standalone: true,
  imports: [CommonModule, MatCardModule, MainMenuComponent, MatToolbarModule],
  templateUrl: './live-scores.component.html',
  styleUrl: './live-scores.component.scss'
})
export class LiveScoresComponent implements OnInit {
  constructor(
    protected fanService: FanService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    if (this.fanService.fan && this.fanService.fan.favourites.length < 1) {
      this.router.navigate(['/manage-favourites']).then();
    }
  }
}
