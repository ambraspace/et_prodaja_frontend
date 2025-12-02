import { flush, TestBed } from '@angular/core/testing';

import { DeliveryService } from './delivery.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Delivery } from '../model/delivery';
import { Company } from '../model/company';
import { Page } from '../model/page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DeliveryService', () => {

  let service: DeliveryService;
  let tester: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(DeliveryService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should retrieve specific delivery', () => {

    const testDelivery: Delivery = {
      id: 'DELIVERY_1',
      deliveryDate: new Date("2025-02-28"),
      status: 'ON_THE_WAY',
      value: 1000.00,
      comment: "",
      supplier: {} as Company,
      supplierReference: "lkjl",
      deliveryItems: []
    };

    service.getDelivery("DELIVERY_1").subscribe(d => {
      expect(d).toEqual(testDelivery);
    });

    let req = tester.expectOne('/api/deliveries/DELIVERY_1');

    expect(req.request.method).toBe('GET');

    req.flush(testDelivery);

  });


  it('should retrieve a page of deliveries', () => {

    const deliveryPage: Page<Delivery> = {
      page: {
        number: 0,
        size: 10,
        totalElements: 25,
        totalPages: 3
      },
      content: [
        {
          id: 'DELIVERY_1',
          deliveryDate: new Date("2025-02-28"),
          status: 'ON_THE_WAY',
          value: 1000.00,
          comment: "",
          supplier: {} as Company,
          supplierReference: "lkjl",
          deliveryItems: []
        },
        {
          id: 'DELIVERY_2',
          deliveryDate: new Date("2025-02-27"),
          status: 'DELIVERED',
          value: 1100.00,
          comment: "",
          supplier: {} as Company,
          supplierReference: "lkjldd",
          deliveryItems: []
        },
        {
          id: 'DELIVERY_3',
          deliveryDate: new Date("2025-02-26"),
          status: 'ON_THE_WAY',
          value: 1200.00,
          comment: "",
          supplier: {} as Company,
          supplierReference: "lkjlffdfd",
          deliveryItems: []
        }   
      ]
    }

    service.getDeliveries(1, 'ON_THE_WAY').subscribe(p => {
      expect(p).toEqual(deliveryPage)
    });

    let req = tester.expectOne('/api/deliveries?page=0&size=10&sort=id,DESC&c=1&s=ON_THE_WAY');

    expect(req.request.method).toBe('GET');

    req.flush(deliveryPage);
  
  });


  it('should add new delivery', () => {

    const delivery: Delivery = 
    {
      id: 'DELIVERY_1',
      deliveryDate: new Date("2025-02-28"),
      status: 'ON_THE_WAY',
      value: 1000.00,
      comment: "",
      supplier: {} as Company,
      supplierReference: "lkjl",
      deliveryItems: []
    };

    service.addDelivery(delivery).subscribe(d => {
      expect(d).toEqual(delivery);
    });

    let req = tester.expectOne('/api/deliveries');

    expect(req.request.method).toBe('POST');

    req.flush(delivery);

  });


  it('should update delivery', () => {

    const delivery: Delivery = 
    {
      id: 'DELIVERY_1',
      deliveryDate: new Date("2025-02-28"),
      status: 'ON_THE_WAY',
      value: 1000.00,
      comment: "",
      supplier: {} as Company,
      supplierReference: "lkjl",
      deliveryItems: []
    };

    service.updateDelivery("DELIVERY_1", delivery).subscribe(d => {
      expect(d).toEqual(delivery);
    });

    let req = tester.expectOne('/api/deliveries/DELIVERY_1');

    expect(req.request.method).toBe('PUT');

    req.flush(delivery);

  });


  it('should delete delivery', () => {

    service.deleteDelivery("DELIVERY_1").subscribe();

    let req = tester.expectOne('/api/deliveries/DELIVERY_1');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });


  it('should change delivery status to DELIVERED', () => {

    const delivery: Delivery = 
    {
      id: 'DELIVERY_1',
      deliveryDate: new Date("2025-02-28"),
      status: 'ON_THE_WAY',
      value: 1000.00,
      comment: "",
      supplier: {} as Company,
      supplierReference: "lkjl",
      deliveryItems: []
    };

    service.setDelivered("DELIVERY_1").subscribe(d => {
      expect(d).toEqual(delivery);
    });

    let req = tester.expectOne('/api/deliveries/DELIVERY_1/delivered');

    expect(req.request.method).toBe('PUT');

    req.flush(delivery);

  });


  it('should delete all deliveries', () => {

    service.deleteAllDeliveries().subscribe();

    let req = tester.expectOne('/api/deliveries/all');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });


});
