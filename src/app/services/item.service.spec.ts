import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Item } from '../model/item';
import { Offer } from '../model/offer';
import { StockInfo } from '../model/stock-info';
import { Order } from '../model/order';
import { DeliveryItem } from '../model/delivery-item';
import { Page } from '../model/page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ItemService', () => {

  let service: ItemService;
  let tester: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(ItemService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should retrieve specific offer item', () => {

    const item: Item = {
      id: 1,
      offer: {
        id: 'OFFER_1'
      } as Offer,
      quantity: 3.14,
      grossPrice: 100.00,
      discountPercent: 25.0,
      preview: 'prevew',
      productName: "Product 1",
      stockInfo: {id: 12} as StockInfo
    };

    service.getOfferItem('OFFER_1', 1).subscribe(oi => {
      expect(oi).toEqual(item)
    });

    let req = tester.expectOne('/api/offers/OFFER_1/items/1');

    expect(req.request.method).toBe('GET');

    req.flush(item);

  });


  it('should retrieve specific order item', () => {

    const item: Item = {
      id: 1,
      offer: {
        id: 'OFFER_1'
      } as Offer,
      order: {
        id: "ORDER_1"
      } as Order,
      quantity: 3.14,
      grossPrice: 100.00,
      discountPercent: 25.0,
      preview: 'prevew',
      productName: "Product 1",
      stockInfo: {id: 12} as StockInfo
    };

    service.getOrderItem('ORDER_1', 1).subscribe(oi => {
      expect(oi).toEqual(item)
    });

    let req = tester.expectOne('/api/orders/ORDER_1/items/1');

    expect(req.request.method).toBe('GET');

    req.flush(item);

  });


  it('should retrieve all offer items', () => {

    const offerItems: Item[] = [
      {
        id: 1,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.14,
        grossPrice: 100.00,
        discountPercent: 25.0,
        preview: 'prevew1',
        productName: "Product 1",
        stockInfo: {id: 12} as StockInfo
      },
      {
        id: 2,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.24,
        grossPrice: 200.00,
        discountPercent: 25.0,
        preview: 'prevew2',
        productName: "Product 2",
        stockInfo: {id: 22} as StockInfo
      },
      {
        id: 3,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.34,
        grossPrice: 300.00,
        discountPercent: 25.0,
        preview: 'prevew3',
        productName: "Product 3",
        stockInfo: {id: 32} as StockInfo
      }
    ];

    service.getOfferItems('OFFER_1').subscribe(ois => {
      expect(ois).toEqual(offerItems);
    })

    let req = tester.expectOne('/api/offers/OFFER_1/items');

    expect(req.request.method).toBe('GET');

    req.flush(offerItems);

  });


  it('should retrieve all order items', () => {

    const orderItems: Item[] = [
      {
        id: 1,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        order: {
          id: "ORDER_1",
        } as Order,
        deliveryItems: [
          {
            id: 25
          } as DeliveryItem
        ],
        quantity: 3.14,
        grossPrice: 100.00,
        discountPercent: 25.0,
        preview: 'prevew1',
        productName: "Product 1",
        stockInfo: {id: 12} as StockInfo
      },
      {
        id: 2,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        order: {
          id: "ORDER_1",
        } as Order,
        quantity: 3.24,
        grossPrice: 200.00,
        discountPercent: 25.0,
        preview: 'prevew2',
        productName: "Product 2",
        stockInfo: {id: 22} as StockInfo
      },
      {
        id: 3,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        order: {
          id: "ORDER_1",
        } as Order,
        quantity: 3.34,
        grossPrice: 300.00,
        discountPercent: 25.0,
        preview: 'prevew3',
        productName: "Product 3",
        stockInfo: {id: 32} as StockInfo
      }
    ];

    service.getOrderItems('ORDER_1').subscribe(ois => {
      expect(ois).toEqual(orderItems);
    });

    let req = tester.expectOne('/api/orders/ORDER_1/items');

    expect(req.request.method).toBe('GET');

    req.flush(orderItems);

    service.getOrderItems("ORDER_1", true).subscribe(ois => {
      expect(ois).toEqual(orderItems.filter(i => i.deliveryItems == undefined));
    });

    req = tester.expectOne('/api/orders/ORDER_1/items?ou=true');

    expect(req.request.method).toBe('GET');

    req.flush(orderItems.filter(i => i.deliveryItems == undefined));

  });


  it('should retrieve all unordered items by a supplier', () => {

    const items: Item[] = [
      {
        id: 1,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.14,
        grossPrice: 100.00,
        discountPercent: 25.0,
        preview: 'prevew1',
        productName: "Product 1",
        stockInfo: {id: 12} as StockInfo
      },
      {
        id: 2,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.24,
        grossPrice: 200.00,
        discountPercent: 25.0,
        preview: 'prevew2',
        productName: "Product 2",
        stockInfo: {id: 22} as StockInfo
      },
      {
        id: 3,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.34,
        grossPrice: 300.00,
        discountPercent: 25.0,
        preview: 'prevew3',
        productName: "Product 3",
        stockInfo: {id: 32} as StockInfo
      }
    ];

    const itemPage: Page<Item> = {
      page: {
        number: 0,
        size: 3,
        totalElements: 9,
        totalPages: 3
      },
      content: items
    }

    service.getUnorderedItems(42).subscribe(is => {
      expect(is).toEqual(itemPage);
    });

    let req = tester.expectOne('/api/items?s=42&page=0&size=6&sort=stockInfo.customerReference,ASC&sort=order.closureTime,ASC&sort=id,ASC');

    expect(req.request.method).toBe('GET');

    req.flush(itemPage);
  
  });


  it('should add new items', () => {

    const items: Item[] = [
      {
        id: 1,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.14,
        grossPrice: 100.00,
        discountPercent: 25.0,
        preview: 'prevew1',
        productName: "Product 1",
        stockInfo: {id: 12} as StockInfo
      },
      {
        id: 2,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.24,
        grossPrice: 200.00,
        discountPercent: 25.0,
        preview: 'prevew2',
        productName: "Product 2",
        stockInfo: {id: 22} as StockInfo
      },
      {
        id: 3,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.34,
        grossPrice: 300.00,
        discountPercent: 25.0,
        preview: 'prevew3',
        productName: "Product 3",
        stockInfo: {id: 32} as StockInfo
      }
    ];

    service.addItems("OFFER_1", items).subscribe(is => {
      expect(is).toEqual(items);      
    });

    let req = tester.expectOne('/api/offers/OFFER_1/items');

    expect(req.request.method).toBe('POST');

    req.flush(items);

  });


  it('should update items', () => {

    const items: Item[] = [
      {
        id: 1,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.14,
        grossPrice: 100.00,
        discountPercent: 25.0,
        preview: 'prevew1',
        productName: "Product 1",
        stockInfo: {id: 12} as StockInfo
      },
      {
        id: 2,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.24,
        grossPrice: 200.00,
        discountPercent: 25.0,
        preview: 'prevew2',
        productName: "Product 2",
        stockInfo: {id: 22} as StockInfo
      },
      {
        id: 3,
        offer: {
          id: 'OFFER_1'
        } as Offer,
        quantity: 3.34,
        grossPrice: 300.00,
        discountPercent: 25.0,
        preview: 'prevew3',
        productName: "Product 3",
        stockInfo: {id: 32} as StockInfo
      }
    ];

    service.updateItems("OFFER_1", items).subscribe(is => {
      expect(is).toEqual(items);      
    });

    let req = tester.expectOne('/api/offers/OFFER_1/items');

    expect(req.request.method).toBe('PUT');

    req.flush(items);

  });


  it('should delete an item', () => {

    service.deleteItem("OFFER_1", 42).subscribe();

    let req = tester.expectOne('/api/offers/OFFER_1/items/42');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });

});
