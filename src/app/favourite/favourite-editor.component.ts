import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {instanceToInstance, plainToInstance} from 'class-transformer';
import {AddFavouriteDto} from '../fan/dtos/add-favourite.dto';
import {PlayerDto} from '../fan/dtos/player.dto';
import {FanService} from '../fan/fan.service';
import {FavouriteDto} from '../fan/dtos/favourite.dto';
import {PlayerService} from '../player/player.service';

@Component({
    selector: 'app-favourite-editor',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './favourite-editor.component.html',
    styleUrls: ['./favourite-editor.component.scss']
})
export class FavouriteEditorComponent implements OnInit {
  @Input() set favourite(value: FavouriteDto | undefined) {
    this.setFavourite(value);
  }

  // Form fields
  pdgaNumberFC = new FormControl<number | null>({value: null, disabled: true}, Validators.required);
  nicknameFC = new FormControl<string | null>(null);

  // We handle both adding a favourite and editing a favourite
  isEditMode = false;

  // when adding a favourite player for a fan, we need to look up players by pdga number
  isLoading = false;
  lookupFailed = false;
  putativeFavouritePlayer: PlayerDto | undefined = undefined;

  // when editing a favouritePlayer
  workingFavourite: FavouriteDto | undefined = undefined;

  constructor(
    private playerService: PlayerService,
    private fanService: FanService,
  ) {
  }

  ngOnInit() {
    // When the PDGA number changes, look up the player
    this.pdgaNumberFC.valueChanges
      .pipe(debounceTime(400))
      .subscribe((id) => {
        if (!id) {
          this.isEditMode = false;
          this.putativeFavouritePlayer = undefined;
          this.nicknameFC.setValue(null);
          return;
        }
        this.lookupPlayer(id);
      });
  }

  // Deal with a change in the input value
  private setFavourite(favourite?: FavouriteDto) {
    if (!favourite) {
      // Switch to add mode
      this.isEditMode = false;
      this.workingFavourite = undefined;
      this.nicknameFC.setValue(null);
      this.pdgaNumberFC.setValue(null, {emitEvent: false});
      return;
    }

    // Switch to edit mode
    this.isEditMode = true;
    this.putativeFavouritePlayer = undefined;
    this.workingFavourite = instanceToInstance(favourite);
    this.pdgaNumberFC.setValue(this.workingFavourite.playerId, {emitEvent: false});
    this.nicknameFC.setValue(this.workingFavourite.nickname ?? null);
  }


  /** Lookup PDGA player */
  private lookupPlayer(id: number) {
    // it's possible that the player was already one of the fan's favourites, so check that now
    const fav: FavouriteDto | undefined = this.fanService.isPlayerAFavourite(id);
    if (fav) {
      this.setFavourite(fav);
      return;
    }

    this.isLoading = true;
    this.isEditMode = false;
    this.lookupFailed = false;
    this.putativeFavouritePlayer = undefined;

    this.playerService.getPlayerById(id)
      .subscribe((res) => {
        this.isLoading = false;
        if (!res) {
          this.lookupFailed = true;
          return;
        }
        this.putativeFavouritePlayer = plainToInstance(PlayerDto, res);
      });
  }


  /** Add new favourite */
  addFavourite() {
    if (!this.putativeFavouritePlayer || !this.fanService.fanSignal()) return;

    const newFavourite: AddFavouriteDto = plainToInstance(AddFavouriteDto, {
      playerId: this.putativeFavouritePlayer.id,
      fanId: this.fanService.fanSignal()?.id,
      nickname: this.nicknameFC.value || null,
      order: -1
    });

    this.fanService.addFavourite(newFavourite).subscribe(() => {
      this.resetForm();
    });
  }

  /** Save nickname for existing favourite */
  updateFavourite() {
    if (!this.workingFavourite) return;

    this.workingFavourite.nickname = this.nicknameFC.value || null,

      this.fanService.updateFavourite(this.workingFavourite).subscribe(() => {
        this.resetForm();
      });
  }

  resetForm() {
    this.isEditMode = false;
    this.workingFavourite = undefined;
    this.pdgaNumberFC.setValue(null, {emitEvent: false});
    this.nicknameFC.setValue(null);
    this.putativeFavouritePlayer = undefined;
  }

  getHint(): string | null {
    if (this.isLoading) return 'Looking up player…';
    if (this.lookupFailed) return `Player ${this.pdgaNumberFC.value} not found.`;
    return null;
  }
}
