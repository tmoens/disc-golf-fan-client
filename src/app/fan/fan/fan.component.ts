import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoaderService} from '../../loader.service';
import {FanDto} from '../../DTOs/fan-dto';
import {plainToInstance} from 'class-transformer';
import {FavouriteDto} from '../../DTOs/favourite-dto';

@Component({
  selector: 'app-fan',
  templateUrl: './fan.component.html',
  styleUrl: './fan.component.scss'
})
export class FanComponent {
  @Input() fan!: FanDto;
  @Output() onUpdate = new EventEmitter<FanDto>

  constructor(
    private loaderService: LoaderService,
  ) {
  }


  deleteFavourite(favourite: FavouriteDto) {
    this.loaderService.deleteFavouriteById(this.fan.id, favourite.playerId).subscribe(() => {
      this.onUpdate.emit();
    })
  }
}
