import {Component, Inject} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DgfActionRowComponent } from '../../app-helpers/action-row.component';
import { DgfComponentContainerComponent } from '../../dgf-component-container/dgf-component-container.component';
import { FavouriteDto } from '../dtos/favourite.dto';
import { FanService } from '../fan.service'; // Added imports
import {plainToInstance} from 'class-transformer';

@Component({
  selector: 'dgf-favourite-editor',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatCardModule,
    MatInput,
    MatButton,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    DgfComponentContainerComponent,
    DgfActionRowComponent,
  ],
  templateUrl: './favourite-editor.component.html',
  styleUrl: './favourite-editor.component.scss'
})
export class FavouriteEditorComponent {
  favourite: FavouriteDto;
  nicknameFC = new FormControl<string | null>(null);
  orderFC = new FormControl<number | null>(null);

  constructor(
    private fanService: FanService,
    public dialogRef: MatDialogRef<FavouriteEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {favourite: FavouriteDto}
  ) {
    this.favourite = plainToInstance(FavouriteDto, data.favourite);
    this.nicknameFC.setValue(this.favourite.nickname);
    this.orderFC.setValue(this.favourite.order);
  }

  save() {
    this.favourite.nickname = this.nicknameFC.value;
    this.favourite.order = this.orderFC.value ?? 0;
    this.fanService.updateFavourite(this.favourite).subscribe(() => this.dialogRef.close());
  }

  cancel() {
    this.dialogRef.close();
  }
}
