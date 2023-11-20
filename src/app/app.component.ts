import { Component } from '@angular/core';
import {plainToInstance} from 'class-transformer';
import {FanDto} from './DTOs/fan-dto';
import {LoaderService} from './loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'disc-golf-fan';
  selectedFan: FanDto | null = null;
  constructor(
    private loaderService: LoaderService,
  ) {
  }

  ngOnInit() {
    this.getFanById(1);
  }

  getFanById(fanId: number) {
    this.loaderService.getFanById(fanId).subscribe((data) => {
      if (data) {
        this.selectedFan = plainToInstance(FanDto, data);
      } else {
        this.selectedFan = null;
      }
    })
  }

  onUpdate() {
    if (this.selectedFan) {
      this.getFanById(this.selectedFan.id);
    }
  }

}
