import { TestBed } from '@angular/core/testing';

import { FirebaseAllService } from './firebase-all.service';

describe('FirebaseAllService', () => {
  let service: FirebaseAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
