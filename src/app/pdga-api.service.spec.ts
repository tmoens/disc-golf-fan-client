import { TestBed } from '@angular/core/testing';

import { PdgaApiService } from './pdga-api.service';

describe('PdgaApiService', () => {
  let service: PdgaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdgaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
