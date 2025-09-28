import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../loader.service';
import {FavouriteDto} from '../DTOs/favourite.dto';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {PlayerDto} from '../DTOs/player.dto';
import {plainToInstance} from 'class-transformer';
import {AddFavouriteDto} from '../DTOs/add-favourite.dto';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import { AppTools } from '../shared/app-tools';
import {FanService} from './fan.service';
import {ReorderFavouriteDto} from '../DTOs/reorder-favourite.dto';

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
      .pipe(debounceTime(500))
      .subscribe((data) => {
        this.isLoadingPlayer = true;
        this.onPdgaNumberChange(data)
        this.isLoadingPlayer = false;
      });
  }

  isPlayerAlreadyFavourite(playerId: number): boolean {
    if (this.fanService.fan && this.player) {
      return this.fanService.fan.isFavourite(playerId);
    }
    return false;
  }


  onPdgaNumberChange(value: number | null) {
    if (!value) return;
    if (!this.pdgaNumberFC.value) { return }
    delete(this.player);
    this.loaderService.getPlayerById(this.pdgaNumberFC.value)
      .subscribe((data) => {
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
    // translate the drag from index to a player
    const playerIdToBeMoved = this.fanService.fan?.favourites[event.previousIndex];
    // translate the drop target to the player before or after which the playerToBeMoved was dropped
    const playerIdTarget = this.fanService.fan?.favourites[event.currentIndex];

    if (this.fanService.fan && playerIdTarget && playerIdToBeMoved) {
      const reorderFavouriteDto =
        new ReorderFavouriteDto(this.fanService.fan.id, playerIdToBeMoved.playerId, playerIdTarget.playerId);
      if (event.previousIndex < event.currentIndex) {
        this.fanService.moveFavouriteAfter(reorderFavouriteDto).then();
      }
      if (event.previousIndex > event.currentIndex) {
        this.fanService.moveFavouriteBefore(reorderFavouriteDto).then();
      }
    }
  }

  protected readonly AppTools = AppTools;
}
