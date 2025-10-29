import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import {FanComponent} from './fan.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {SmallScreenScoreDetails} from '../live-scores/small-screen-score-details/small-screen-score-details.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import {MatLineModule} from '@angular/material/core';
import {AuthModule} from '../auth/auth.module';
import {MainMenuComponent} from '../main-menu/main-menu.component';

@NgModule({
  declarations: [
    FanComponent,
  ],
  imports: [
    AuthModule,
    CommonModule,
    MatToolbarModule,
    MatListModule,
    SmallScreenScoreDetails,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    CdkDropListGroup,
    MatCardModule,
    CdkDrag,
    FormsModule,
    CdkDropList,
    MatLineModule,
    CdkDragHandle,
    MainMenuComponent,
    ToolbarComponent,
  ],
  exports: [
    FanComponent,
  ]
})
export class FanModule { }
