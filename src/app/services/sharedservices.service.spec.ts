import { TestBed, inject } from '@angular/core/testing';

import { SharedservicesService } from './sharedservices.service';

describe('SharedservicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedservicesService]
    });
  });

  it('should be created', inject([SharedservicesService], (service: SharedservicesService) => {
    expect(service).toBeTruthy();
  }));
});
