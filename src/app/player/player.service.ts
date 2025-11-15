import {Injectable} from '@angular/core';
import {PlayerDto} from '../fan/dtos/player.dto';
import {LoaderService} from '../loader.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private readonly loaderService: LoaderService) {
  }

  getPlayerById(id: number): Observable<PlayerDto | null> {
    return this.loaderService.getPlayerById(id);
  }

}
