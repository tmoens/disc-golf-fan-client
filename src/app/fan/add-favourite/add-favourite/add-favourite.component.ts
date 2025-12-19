import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { plainToInstance } from 'class-transformer';
import { debounceTime } from 'rxjs';
import { DgfActionRowComponent } from '../../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../../dgf-component-container/dgf-component-container.component';
import { PlayerService } from '../../../player/player.service';
import { FanDto } from '../../dtos/fan.dto';
import { FavouriteDto } from '../../dtos/favourite.dto';
import { PlayerDto } from '../../dtos/player.dto';
import { FanService } from '../../fan.service';

@Component({
  standalone: true,
  selector: 'app-add-favourite',
  imports: [
    DgfActionRowComponent,
    DgfComponentContainerComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatHint,
    MatTooltip,
    MatSuffix,
    MatIconButton,
  ],
  templateUrl: './add-favourite.component.html',
  styleUrl: './add-favourite.component.scss'
})
export class AddFavouriteComponent implements OnInit {

  @Output() saveRequest = new EventEmitter<FavouriteDto>();
  @Output() cancelRequest = new EventEmitter<void>();

  favourite: FavouriteDto = new FavouriteDto();
  pdgaNumberFC = new FormControl<number | null>(null);
  nicknameFC = new FormControl<string | null>(null);
  orderFC = new FormControl<number | null>(0);
  fan: FanDto | null = null;

  lookupFailed = false;
  playerIdentifiedByPdgaNumber: PlayerDto | undefined = undefined;
  existingFavourite: FavouriteDto | undefined = undefined;

  constructor(
    private fanService: FanService,
    private playerService: PlayerService,
  ) {
    this.fan = this.fanService.fanSignal();
  }

  ngOnInit() {
    if (this.fan) {
      this.favourite.fanId = this.fan.id;
    }

    this.pdgaNumberFC.valueChanges
      .pipe(debounceTime(400))
      .subscribe((id) => {
        if (!id) return;
        this.lookupPlayer(id);
      });
  }

  save() {
    if (!this.pdgaNumberFC.value) return;

    this.favourite.playerId = this.pdgaNumberFC.value;
    this.favourite.nickname = this.nicknameFC.value;
    this.favourite.order = this.orderFC.value ?? 0;
    console.log(JSON.stringify(this.favourite));
    this.fanService.addFavourite(this.favourite).subscribe(() => {
      this.saveRequest.emit(this.favourite);
    });
  }

  cancel() {
    this.cancelRequest.emit();
  }

  /** Lookup player by PDGA Number */
  private lookupPlayer(id: number) {
    this.nicknameFC.setValue(null);
    this.orderFC.setValue(0);
    this.lookupFailed = false;
    this.playerIdentifiedByPdgaNumber = undefined;
    this.existingFavourite = undefined;

    // it's possible that the player was already one of the fan's favourites, so check that now
    this.existingFavourite = this.fan?.hasFavourite(id);

    this.playerService.getPlayerById(id)
      .subscribe((res) => {
        if (!res) {
          this.lookupFailed = true;
          return;
        }
        this.playerIdentifiedByPdgaNumber = plainToInstance(PlayerDto, res);
      });
  }

  getHint(): string | null {
    if (this.lookupFailed) return `Player ${this.pdgaNumberFC.value} not found.`;
    if (this.existingFavourite) return `${this.existingFavourite.name} is already a favourite.`;
    return null;
  }
}
