import { TestBed } from '@angular/core/testing';

import { InMemoryDataService } from './in-memory-data.service';
import { Hero } from './hero';

describe('InMemoryDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InMemoryDataService = TestBed.get(InMemoryDataService);
    expect(service).toBeTruthy();
  });

  it("should create a message in an array", () => {
    const service: InMemoryDataService = TestBed.get(InMemoryDataService);
    var heroes = service.createDb();
    expect(heroes).not.toBeNull();
  });

  it("should return 11 if the heroes array is empty", () => {
    const service: InMemoryDataService = TestBed.get(InMemoryDataService);
    var heroes : Hero[] = [];
    expect(service.genId(heroes)).toEqual(11);
  });

  it("should return 21 when heroes array has values", () => {
    const service: InMemoryDataService = TestBed.get(InMemoryDataService);
    var heroes : Hero[];
    heroes = service.createDb();
    expect(service.genId(heroes)).toEqual(21);
  });
});
