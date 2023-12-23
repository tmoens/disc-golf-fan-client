import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {instanceToInstance, plainToInstance} from 'class-transformer';
import {PlayerDto} from '../../DTOs/player-dto';
import {LoaderService} from '../../loader.service';
import {FanService} from '../fan.service';
import {debounceTime} from 'rxjs';
import {AddFavouriteDto} from '../../DTOs/add-favourite-dto';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-add-favourite-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDialogActions, MatListModule],
  templateUrl: './add-favourite-dialog.component.html',
  styleUrl: './add-favourite-dialog.component.scss'
})
export class AddFavouriteDialogComponent implements OnInit {
  pdgaNumberFC: FormControl = new FormControl<number | null>(null)
  isLoadingPlayer = false;
  lookupFailed = false;
  player: PlayerDto | undefined;
  favouritesAdded: PlayerDto[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddFavouriteDialogComponent>,
    private loaderService: LoaderService,
    protected fanService: FanService,
  ) { }

  ngOnInit() {
    this.pdgaNumberFC.valueChanges
      .pipe(debounceTime(200))
      .subscribe((data) => this.onPdgaNumberChange(data));
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
    this.favouritesAdded.push(instanceToInstance<PlayerDto>(this.player));
    this.pdgaNumberFC.setValue(null);
    const newFavourite: AddFavouriteDto = plainToInstance(AddFavouriteDto, {
      playerId: this.player.id,
      fanId: this.fanService.fan.id,
      order: -1
    });
    this.loaderService.addFavourite(newFavourite)
      .subscribe(() => this.fanService.reload());
  }


  isPlayerAlreadyFavourite(playerId: number): boolean {
    if (this.fanService.fan && this.player) {
      return this.fanService.fan.isFavourite(playerId);
    }
    return false;
  }

  done() {
    this.dialogRef.close();
  }

}
