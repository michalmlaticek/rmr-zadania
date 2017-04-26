import { TestBed, inject } from '@angular/core/testing';

import { ScanDataService } from './scan-data.service';

describe('ScanDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScanDataService]
    });
  });

  it('should ...', inject([ScanDataService], (service: ScanDataService) => {
    expect(service).toBeTruthy();
  }));
});
