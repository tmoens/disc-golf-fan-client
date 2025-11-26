import {Component, Inject} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DgfComponentContainerComponent } from '../dgf-component-container/dgf-component-container.component';
import { FavouriteDto } from '../fan/dtos/favourite.dto';
import { FanService } from '../fan/fan.service'; // Added imports
import {plainToInstance} from 'class-transformer';

export interface FavouriteEditorData {
  favourite: FavouriteDto;
  mode: 'add' | 'edit';
}


@Component({
  selector: 'app-favourite-editor',
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
  ],
  templateUrl: './favourite-editor.component.html',
  styleUrl: './favourite-editor.component.scss'
})
export class FavouriteEditorComponent {
  nicknameFC = new FormControl<string | null>(null);
  favourite: FavouriteDto; // Changed from @Input to property
  mode: 'add' | 'edit';
  title: string;
  buttonLabel: string

  constructor(
    private fanService: FanService,
    public dialogRef: MatDialogRef<FavouriteEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FavouriteEditorData
  ) {
    this.favourite = plainToInstance(FavouriteDto, data.favourite);
    this.mode = data.mode;

    if (this.mode === 'edit') {
      this.nicknameFC.setValue(this.favourite.nickname);
      this.buttonLabel = 'Save Changes';
      this.title = `Editing ${this.favourite.playerName}:`;
    } else {
      this.nicknameFC.setValue(null);
      this.buttonLabel = 'Add Favourite';
      this.title = `Adding ${this.favourite.playerName}:`;
    }
  }

  save() {
    this.favourite.nickname = this.nicknameFC.value;
    if (this.mode === 'edit') {
      this.fanService.updateFavourite(this.favourite).subscribe(() => this.dialogRef.close());
    } else {
      this.fanService.addFavourite(this.favourite as any).subscribe(() => this.dialogRef.close());
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
