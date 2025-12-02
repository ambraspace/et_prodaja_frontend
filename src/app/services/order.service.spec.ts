import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Order } from '../model/order';
import { Warehouse } from '../model/warehouse';
import { Page } from '../model/page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OrderService', () => {


  let service: OrderService;
  let tester: HttpTestingController;


  beforeEach(() => {

    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(OrderService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return specific order', () => {

    const order: Order = {
      id: 'ORDER_1',
      status: 'OPEN',
      value: 1000.0,
      warehouse: {
        id: 4
      } as Warehouse,
      creationDate: new Date('2025-03-05')
    } as Order;

    service.getOrder("ORDER_1").subscribe(o => {
      expect(o).toEqual(order);
    });

    let req = tester.expectOne('/api/orders/ORDER_1');

    expect(req.request.method).toBe('GET');

    req.flush(order);

  });


  it('should return a page of orders', () => {

    const page: Page<Order> = {
      page: {
        number: 0,
        size: 10,
        totalElements: 100,
        totalPages: 10
      },
      content: [
        {
          id: 'ORDER_1',
          status: 'OPEN',
          value: 1000.0,
          warehouse: {
            id: 4
          } as Warehouse,
          creationDate: new Date('2025-03-05')
        } as Order,
        {
          id: 'ORDER_2',
          status: 'CLOSED',
          value: 2000.0,
          warehouse: {
            id: 5
          } as Warehouse,
          creationDate: new Date('2025-03-06')
        } as Order,
        {
          id: 'ORDER_3',
          status: 'OPEN',
          value: 3000.0,
          warehouse: {
            id: 6
          } as Warehouse,
          creationDate: new Date('2025-03-07')
        } as Order
      ]
    };

    service.getOrders(1, 'CLOSED', true).subscribe(os => {
      expect(os).toEqual(page);
    });

    let req = tester.expectOne('/api/orders?page=0&size=10&sort=id,DESC&w=1&s=CLOSED&u=true');

    expect(req.request.method).toBe('GET');

    req.flush(page);

  });


  it('should close order', () => {

    service.closeOrder('ORDER_1').subscribe();

    let req = tester.expectOne('/api/orders/ORDER_1/close');

    expect(req.request.method).toBe('PUT');

    req.flush(null);

  });


  it('should download order', () => {

    const file: Blob = new Blob(["BLOB"])

    service.downloadOrder("ORDER_1").subscribe(o => {
      expect(o.body).toBe(file);
    });

    let req = tester.expectOne('/api/orders/ORDER_1/dl');

    expect(req.request.method).toBe('GET');

    req.flush(file);

  });


  it('should delete all orders', () => {

    service.deleteAllOrders().subscribe();

    let req = tester.expectOne('/api/orders/all');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });



});
