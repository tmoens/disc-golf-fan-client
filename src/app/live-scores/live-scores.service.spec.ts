import { TestBed } from '@angular/core/testing';

import { LiveScoresService } from './live-scores.service';

describe('LiveScoresService', () => {
  let service: LiveScoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveScoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
