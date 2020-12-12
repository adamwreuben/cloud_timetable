import { TestBed } from '@angular/core/testing';

import { StatusServeService } from './status-serve.service';

describe('StatusServeService', () => {
  let service: StatusServeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusServeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
