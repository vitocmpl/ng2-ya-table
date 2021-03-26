import { TestBed } from '@angular/core/testing';

import { Ng2YaTableService } from './ng2-ya-table.service';

describe('Ng2YaTableService', () => {
  let service: Ng2YaTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ng2YaTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
