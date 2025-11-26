import { Component, Input, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AppStateService } from '../app-state.service';
import {AuthService} from '../auth/auth.service';
import {MainMenuComponent} from '../main-menu/main-menu.component';
import {DGF_TOOL_KEY} from '../tools/dgf-took-keys';
import { DgfTool } from '../tools/dgf-tool';
import { DGF_TOOL_ROUTES } from '../tools/dgf-tool-routes';
import { DgfToolsService } from '../tools/dgf-tools.service';

@Component({
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
  ],
  styleUrl: './dgf-toolbar.component.scss'
})
export class DgfToolbarComponent implements OnInit{
  @Input() titlePrefix = 'Disc Golf Fan';
  protected loginTool: DgfTool;
  protected logoutTool: DgfTool;

  constructor(
    protected readonly router: Router,
    protected readonly appState: AppStateService,
    protected readonly authService: AuthService,
    protected readonly toolService: DgfToolsService,
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
    this.router.navigate([DGF_TOOL_ROUTES.LOGIN]);
  }

  onLogoutClick() {
    this.router.navigate([DGF_TOOL_ROUTES.LOGOUT]);
  }
}
