import { TestBed } from '@angular/core/testing';

import { StockInfoService } from './stock-info.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StockInfo } from '../model/stock-info';
import { Product } from '../model/product';
import { Warehouse } from '../model/warehouse';
import { Page } from '../model/page';

describe('StockInfoService', () => {

  let service: StockInfoService;
  let tester: HttpTestingController;

  beforeEach(() => {
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(StockInfoService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return specific StockInfo object', () => {

    const stockInfo: StockInfo = {
      id: 1,
      availableQuantity: 10,
      customerReference: "PP001",
      product: {
        id: 1
      } as Product,
      quantity: 2,
      repairableQuantity: 0,
      unitPrice: 3.14,
      warehouse: {
        id: 2
      } as Warehouse
    };

    service.getStockInfo(1, 1).subscribe(si => {
      expect(si).toEqual(stockInfo);
    });

    let req = tester.expectOne('/api/products/1/stockInfos/1');

    expect(req.request.method).toBe('GET');

    req.flush(stockInfo);

  });


  it('should return a page of StockInfo objects', () => {

    const page: Page<StockInfo> = {
      page: {
        number: 0,
        size: 10,
        totalElements: 314,
        totalPages: 32
      },
      content: [
        {
          id: 1,
          availableQuantity: 10,
          customerReference: "PP001",
          product: {
            id: 1
          } as Product,
          quantity: 2,
          repairableQuantity: 0,
          unitPrice: 3.14,
          warehouse: {
            id: 2
          } as Warehouse
        },
        {
          id: 2,
          availableQuantity: 20,
          customerReference: "PP002",
          product: {
            id: 2
          } as Product,
          quantity: 3,
          repairableQuantity: 0,
          unitPrice: 4.14,
          warehouse: {
            id: 3
          } as Warehouse
        },
        {
          id: 3,
          availableQuantity: 30,
          customerReference: "PP003",
          product: {
            id: 3
          } as Product,
          quantity: 4,
          repairableQuantity: 0,
          unitPrice: 5.14,
          warehouse: {
            id: 4
          } as Warehouse
        }  
      ]
    };

    service.getStockInfosByProduct(2).subscribe(p => {
      expect(p).toEqual(page);
    });

    let req = tester.expectOne('/api/products/2/stockInfos?page=0&size=10&sort=id,ASC');

    expect(req.request.method).toBe('GET');

    req.flush(page);

  });


  it('should add new StockInfo object', () => {

    const stockInfo: StockInfo = {
      id: 1,
      availableQuantity: 10,
      customerReference: "PP001",
      product: {
        id: 1
      } as Product,
      quantity: 2,
      repairableQuantity: 0,
      unitPrice: 3.14,
      warehouse: {
        id: 2
      } as Warehouse
    };

    service.addStockInfo(1, stockInfo).subscribe(si => {
      expect(si).toEqual(stockInfo);
    });

    let req = tester.expectOne('/api/products/1/stockInfos');

    expect(req.request.method).toBe('POST');

    req.flush(stockInfo);

  });


  it('should update existing StockInfo object', () => {

    const stockInfo: StockInfo = {
      id: 1,
      availableQuantity: 10,
      customerReference: "PP001",
      product: {
        id: 1
      } as Product,
      quantity: 2,
      repairableQuantity: 0,
      unitPrice: 3.14,
      warehouse: {
        id: 2
      } as Warehouse
    };

    service.updateStockInfo(1, 1, stockInfo).subscribe(si => {
      expect(si).toEqual(stockInfo);
    });

    let req = tester.expectOne('/api/products/1/stockInfos/1');

    expect(req.request.method).toBe('PUT');

    req.flush(stockInfo);

  });


  it('should delete existing StockInfo object', () => {

    service.deleteStockInfo(1, 1).subscribe();

    let req = tester.expectOne('/api/products/1/stockInfos/1');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });



});
