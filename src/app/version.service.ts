import { Injectable } from '@angular/core';
import pkg from '../../package.json';

@Injectable({ providedIn: 'root' })
export class VersionService {
  readonly version = pkg.version;
}
