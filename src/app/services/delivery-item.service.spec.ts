import { TestBed } from '@angular/core/testing';

import { DeliveryItemService } from './delivery-item.service';

describe('DeliveryItemService', () => {
  let service: DeliveryItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
