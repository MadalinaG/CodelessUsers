import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageService = TestBed.get(MessageService);
    expect(service).toBeTruthy();
  });

  it("should create a message in an array", () => {
    const service: MessageService = TestBed.get(MessageService);
    const qouteText = "This is my first post";
    service.add(qouteText);
    expect(service.messages.length).toBeGreaterThanOrEqual(1);
  });

  it("should remove a created post from the array of posts", () => {
    const service: MessageService = TestBed.get(MessageService);
    service.add("This is my first post");
    service.clear();
    expect(service.messages.length).toBeLessThan(1);
  });

});
