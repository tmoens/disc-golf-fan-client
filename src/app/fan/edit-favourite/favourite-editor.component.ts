import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { plainToInstance } from 'class-transformer';
import { DgfActionRowComponent } from '../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import { FavouriteDto } from '../dtos/favourite.dto';
import { FanService } from '../fan.service';


@Component({
  selector: 'dgf-favourite-editor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatIcon,
    MatCardModule,
    DgfComponentContainerComponent,
    DgfActionRowComponent,
    MatIconButton,
    MatSuffix,
    MatTooltip,
  ],
  templateUrl: './favourite-editor.component.html',
  styleUrl: './favourite-editor.component.scss'
})
export class FavouriteEditorComponent implements OnInit {

  @Input() favourite!: FavouriteDto;

  @Output() saveRequest = new EventEmitter<FavouriteDto>();
  @Output() cancelRequest = new EventEmitter<void>();

  nicknameFC = new FormControl<string | null>(null);
  orderFC = new FormControl<number | null>(null);

  constructor(private fanService: FanService) {}

  ngOnInit() {
    if (!this.favourite) {
      throw new Error('FavouriteEditorComponent requires a FavouriteDto @Input().');
    }

    // Clone to avoid mutating original before save
    this.favourite = plainToInstance(FavouriteDto, this.favourite);

    this.nicknameFC.setValue(this.favourite.nickname);
    this.orderFC.setValue(this.favourite.order);
  }

  save() {
    this.favourite.nickname = this.nicknameFC.value;
    this.favourite.order = this.orderFC.value ?? 0;

    this.fanService.updateFavourite(this.favourite)
      .subscribe(() => this.saveRequest.emit(this.favourite));
  }

  cancel() {
    this.cancelRequest.emit();
  }
}
