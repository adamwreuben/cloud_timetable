import { TestBed } from '@angular/core/testing';

import { AutogenerateService } from './autogenerate.service';

describe('AutogenerateService', () => {
  let service: AutogenerateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutogenerateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
