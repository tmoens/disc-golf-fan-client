import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../loader.service';
import {FavouriteDto} from '../DTOs/favourite-dto';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {PlayerDto} from '../DTOs/player-dto';
import {plainToInstance} from 'class-transformer';
import {AddFavouriteDto} from '../DTOs/add-favourite-dto';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {FanService} from './fan.service';

@Component({
  selector: 'app-fan',
  templateUrl: './fan.component.html',
  styleUrl: './fan.component.scss'
})
export class FanComponent implements OnInit {
  pdgaNumberFC: FormControl = new FormControl<number | null>(null)
  isLoadingPlayer = false;
  lookupFailed = false;
  player: PlayerDto | undefined;

  constructor(
    private loaderService: LoaderService,
    protected fanService: FanService,
  ) {
  }

  ngOnInit() {
    this.pdgaNumberFC.valueChanges
      .pipe(debounceTime(200))
      .subscribe((data) => this.onPdgaNumberChange(data));
  }

  isPlayerAlreadyFavourite(playerId: string): boolean {
    if (this.fanService.fan && this.player) {
      return this.fanService.fan.isFavourite(playerId);
    }
    return false;
  }


  onPdgaNumberChange(value: number | null) {
    delete(this.player);
    if (!value) return;
    this.isLoadingPlayer = true;
    if (!this.pdgaNumberFC.value) { return }
    this.loaderService.getPlayerById(this.pdgaNumberFC.value)
      .subscribe((data) => {
        this.isLoadingPlayer = false;
        if (data) {
          this.lookupFailed = false;
          this.player = plainToInstance(PlayerDto, data);
        } else {
          this.lookupFailed = true;
        }
      });
  }

  getHint(): string | null {
    if (this.isLoadingPlayer) {
      return 'Doing lookup...'
    }
    if (this.lookupFailed) {
      return `Player ${this.pdgaNumberFC.value} not found.`;
    }
    return null;
  }

  addFavourite() {
    if (!this.fanService.fan || !this.player) {
      return;
    }
    this.pdgaNumberFC.setValue(null);
    const newFavourite: AddFavouriteDto = plainToInstance(AddFavouriteDto, {
      playerId: this.player.id,
      fanId: this.fanService.fan.id,
      order: -1
    });
    this.loaderService.addFavourite(newFavourite).subscribe(() => {
      this.fanService.reload();
    })
  }

  // TODO When we get around to doing nicknames for our favourites
  // async onNicknameChange(favourite: FavouriteDto) {
  //   await lastValueFrom(this.loaderService.updateFavourite(favourite));
  // }

  deleteFavourite(favourite: FavouriteDto) {
    this.loaderService.deleteFavourite(favourite).subscribe(() => {
      this.fanService.reload();
    })
  }

  onDrop(event: CdkDragDrop<FavouriteDto[]>) {
    this.fanService.moveFavourite(event.previousIndex, event.currentIndex);
  }

}
