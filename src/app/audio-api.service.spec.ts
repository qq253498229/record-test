import { TestBed, inject } from '@angular/core/testing';

import { AudioApiService } from './audio-api.service';

describe('AudioApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioApiService]
    });
  });

  it('should be created', inject([AudioApiService], (service: AudioApiService) => {
    expect(service).toBeTruthy();
  }));
});
