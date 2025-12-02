import { TestBed } from '@angular/core/testing';

import { DeliveryItemService } from './delivery-item.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DeliveryItem } from '../model/delivery-item';
import { Item } from '../model/item';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DeliveryItemService', () => {

  let service: DeliveryItemService;
  let tester: HttpTestingController;


  beforeEach(() => {
    
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(DeliveryItemService);
    tester = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should get specific delivery item', () => {

    const deliveyItem: DeliveryItem = {
      id: 10,
      item: {} as Item,
      quantity: 14.4
    };

    service.getDeliveryItem("DELIVERY_1", 10).subscribe(di => {
      expect(di).toEqual(deliveyItem);
    });

    let req = tester.expectOne('/api/deliveries/DELIVERY_1/deliveryItems/10');

    expect(req.request.method).toBe('GET');

    req.flush(deliveyItem);

  });


  it('should get all delivery items', () => {

    const deliveryItems: DeliveryItem[] = [
      {
        id: 10,
        item: {} as Item,
        quantity: 14.4
      },
      {
        id: 20,
        item: {} as Item,
        quantity: 15.5
      },
      {
        id: 30,
        item: {} as Item,
        quantity: 16.6
      }
    ];

    service.getDeliveryItems("DELIVERY_1").subscribe(dis => {
      expect(dis).toEqual(deliveryItems);
    });

    let req = tester.expectOne('/api/deliveries/DELIVERY_1/deliveryItems');

    expect(req.request.method).toBe('GET');

    req.flush(deliveryItems);

  });


  it('should add delivery items', () => {

    const deliveryItems: DeliveryItem[] = [
      {
        id: 10,
        item: {} as Item,
        quantity: 14.4
      },
      {
        id: 20,
        item: {} as Item,
        quantity: 15.5
      },
      {
        id: 30,
        item: {} as Item,
        quantity: 16.6
      }
    ];

    service.addDeliveryItems("DELIVERY_1", deliveryItems).subscribe(dis => {
      expect(dis).toEqual(deliveryItems);
    });

    let req = tester.expectOne('/api/deliveries/DELIVERY_1/deliveryItems');

    expect(req.request.method).toBe("POST");

    req.flush(deliveryItems);

  });


  it('should update delivery item', () => {

    const deliveyItem: DeliveryItem = {
      id: 10,
      item: {} as Item,
      quantity: 14.4
    };

    service.updateDeliveryItem('DELIVERY_1', 10, deliveyItem).subscribe(di => {
      expect(di).toEqual(deliveyItem);
    });

    let req = tester.expectOne('/api/deliveries/DELIVERY_1/deliveryItems/10');

    expect(req.request.method).toBe('PUT');

    req.flush(deliveyItem);
  
  });


  it('should delete delivery item', () => {

    service.deleteDeliveryItem('DELIVERY_1', 10).subscribe();

    let req = tester.expectOne('/api/deliveries/DELIVERY_1/deliveryItems/10');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });


});
