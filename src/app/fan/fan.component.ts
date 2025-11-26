import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { plainToInstance } from 'class-transformer';
import { debounceTime } from 'rxjs';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import { FavouriteEditorComponent } from '../favourite/favourite-editor.component';
import { PlayerService } from '../player/player.service';
import {FavouriteDto} from './dtos/favourite.dto';
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import { PlayerDto } from './dtos/player.dto';
import {FanService} from './fan.service';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-fan',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FormsModule,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatHint,
    MatDialogModule,
    DgfComponentContainerComponent,
  ],
  templateUrl: './fan.component.html',
  styleUrl: './fan.component.scss'
})
export class FanComponent implements OnInit {
  pdgaNumberFC = new FormControl<number | null>({value: null, disabled: false});
  playerIdentifiedByPdgaNumber: PlayerDto | undefined = undefined;
  existingFavourite: FavouriteDto | undefined;
  isLoading = false;
  lookupFailed = false;
  // favouriteToEdit: FavouriteDto | undefined; // No longer needed

  constructor(
    protected fanService: FanService,
    protected playerService: PlayerService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    // When the PDGA number changes, look up the player
    this.pdgaNumberFC.valueChanges
      .pipe(debounceTime(400))
      .subscribe((id) => {
        if (!id) {
          return;
        }
        this.lookupPlayer(id);
      });
  }

  addPlayerAsFavourite(player: PlayerDto) {
    const favouriteToEdit = new FavouriteDto();
    favouriteToEdit.playerId = player.id;
    favouriteToEdit.playerName = player.name;
    favouriteToEdit.fanId = this.fanService.fanSignal()?.id || ''; // Ensure we have fanId
    favouriteToEdit.nickname = null;
    favouriteToEdit.order = -1;

    this.openEditor(favouriteToEdit, 'add');
  }

  editFavourite(favourite: FavouriteDto) {
    this.openEditor(favourite, 'edit');
  }

  private openEditor(favourite: FavouriteDto, mode: 'add' | 'edit') {
    this.dialog.open(FavouriteEditorComponent, {
      data: { favourite, mode },
      width: '400px' // Adjust size as needed
    });
  }

  deleteFavourite(favourite: FavouriteDto) {
    this.fanService.deleteFavourite(favourite).subscribe();
  }

  onDrop(event: CdkDragDrop<FavouriteDto[]>) {
    this.fanService.moveFavourite(event.previousIndex, event.currentIndex);
  }

  /** Lookup PDGA player */
  private lookupPlayer(id: number) {
    this.isLoading = true;
    this.lookupFailed = false;
    this.playerIdentifiedByPdgaNumber = undefined;
    this.existingFavourite = undefined;

    // it's possible that the player was already one of the fan's favourites, so check that now
    const fav: FavouriteDto | undefined = this.fanService.isPlayerAFavourite(id);
    if (fav) {
      this.existingFavourite = fav;
      this.isLoading = false;
      return;
    }

    this.playerService.getPlayerById(id)
      .subscribe((res) => {
        this.isLoading = false;
        if (!res) {
          this.lookupFailed = true;
          return;
        }
        this.playerIdentifiedByPdgaNumber = plainToInstance(PlayerDto, res);
      });
  }

  getHint(): string | null {
    if (this.isLoading) return 'Looking up player…';
    if (this.lookupFailed) return `Player ${this.pdgaNumberFC.value} not found.`;
    return null;
  }
}
