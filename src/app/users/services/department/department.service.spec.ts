import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';

describe('DepartmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[],
    
  }));

  it('should be created', () => {
    const service: DepartmentService = TestBed.get(DepartmentService);
    expect(service).toBeTruthy();
  });
});
