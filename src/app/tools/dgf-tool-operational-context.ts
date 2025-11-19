import {AuthService} from '../auth/auth.service';
import {DgfTool} from './dgf-tool';

export interface DgfToolOperationalContext {
  /**
   * Provides authentication status and a current user role.
   */
  readonly auth: AuthService;

  /**
   * Returns true if this tool is currently the active tool.
   * Implemented by DdfToolsService using AppStateService.
   * Tools DO NOT inject AppStateService directly.
   */
  isActive(tool: DgfTool): boolean;
}
