import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AppStateService } from '../app-state.service';
import {AuthService} from '../auth/auth.service';
import {
  AddFavouriteBottomSheetComponent
} from '../fan/add-favourite/add-favourite/add-favourite-bottomsheet.component';
import { AddFavouriteDialogComponent } from '../fan/add-favourite/add-favourite/add-favourite-dialog.component';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';
import { DgfTool } from '../tools/dgf-tool';
import { DGF_TOOL_ROUTES } from '../tools/dgf-tool-routes';
import { DgfToolsService } from '../tools/dgf-tools.service';

@Component({
  standalone: true,
  selector: 'dgf-toolbar',
  templateUrl: './dgf-toolbar.component.html',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MainMenuComponent,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatBottomSheetModule,
  ],
  styleUrl: './dgf-toolbar.component.scss'
})
export class DgfToolbarComponent implements OnInit{
  titlePrefix = 'Disc Golf Fan';
  shortTitlePrefix = 'DG Fan';
  protected loginTool: DgfTool;
  protected logoutTool: DgfTool;


  constructor(
    protected readonly router: Router,
    protected readonly appState: AppStateService,
    protected readonly authService: AuthService,
    protected readonly toolService: DgfToolsService,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
  ) {
    this.loginTool = this.toolService.getByKey(DGF_TOOL_KEY.LOGIN);
    this.logoutTool = this.toolService.getByKey(DGF_TOOL_KEY.LOGOUT);
  }

  ngOnInit() {
  }

  get activeTool() {
    return this.appState.activeTool();
  }

  onLoginClick() {
    void this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
  }

  onLogoutClick() {
    void this.router.navigate([DGF_TOOL_ROUTES.LOGOUT]);
  }

  onAddUserClick() {
    if (this.appState.screenInfo().isSmall) {
      // → Open as bottom sheet
      this.bottomSheet.open(AddFavouriteBottomSheetComponent, {
        // You can tune these later.
        // Leave it minimal for now.
        disableClose: false,
      });

    } else {
      // → Standard dialog for tablets/desktops
      this.dialog.open(AddFavouriteDialogComponent, {
        width: '500px',
      });
    }
  }

  protected readonly DGF_TOOL_KEY = DGF_TOOL_KEY;
}
