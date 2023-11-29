import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoaderService} from '../loader.service';
import {FanService} from '../fan/fan.service';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-live-scores',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './live-scores.component.html',
  styleUrl: './live-scores.component.scss'
})
export class LiveScoresComponent implements OnInit {
  constructor(
    private loaderService: LoaderService,
    protected fanService: FanService,
  ) {
  }

  ngOnInit() {
    this.fanService.getFanById(1);
  }
}
