import { TestBed } from '@angular/core/testing';

import { WarehouseService } from './warehouse.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Warehouse } from '../model/warehouse';
import { Company } from '../model/company';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('WarehouseService', () => {


  let service: WarehouseService;
  let tester: HttpTestingController;


  beforeEach(() => {

    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(WarehouseService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return all warehouses by a company', () => {

    const warehouses: Warehouse[] = [
      {
        id: 1,
        company: {
          id: 1
        } as Company,
        name: "Warehouse 1",
      },
      {
        id: 2,
        company: {
          id: 1
        } as Company,
        name: "Warehouse 2",
      },
      {
        id: 3,
        company: {
          id: 1
        } as Company,
        name: "Warehouse 3",
      }
    ];

    service.getWarehouses(1).subscribe(ws => {
      expect(ws).toEqual(warehouses);
    });

    let req = tester.expectOne('/api/companies/1/warehouses');

    expect(req.request.method).toBe('GET');

    req.flush(warehouses);

  });


  it('should return single warehouse by company id and warehouse id', () => {

    const warehouse: Warehouse = {
      id: 1,
      company: {
        id: 1
      } as Company,
      name: "Warehouse 1",
    };

    service.getWarehouse(1, 1).subscribe(w => {
      expect(w).toEqual(warehouse);
    });

    let req = tester.expectOne('/api/companies/1/warehouses/1');

    expect(req.request.method).toBe('GET');

    req.flush(warehouse);

  });


  it('should return single warehouse by its id', () => {

    const warehouse: Warehouse = {
      id: 1,
      company: {
        id: 1
      } as Company,
      name: "Warehouse 1",
    };

    service.getWarehouseById(1).subscribe(w => {
      expect(w).toEqual(warehouse);
    });

    let req = tester.expectOne('/api/warehouses/1');

    expect(req.request.method).toBe('GET');

    req.flush(warehouse);

  });


  it('should add a warehouse', () => {

    const warehouse: Warehouse = {
      id: 1,
      company: {
        id: 1
      } as Company,
      name: "Warehouse 1",
    };

    service.addWarehouse(1, warehouse).subscribe(w => {
      expect(w).toEqual(warehouse);
    });

    let req = tester.expectOne('/api/companies/1/warehouses');

    expect(req.request.method).toBe('POST');

    req.flush(warehouse);

  });


  it('should update a warehouse', () => {

    const warehouse: Warehouse = {
      id: 1,
      company: {
        id: 1
      } as Company,
      name: "Warehouse 1",
    };

    service.updateWarehouse(1, 1, warehouse).subscribe(w => {
      expect(w).toEqual(warehouse);
    });

    let req = tester.expectOne('/api/companies/1/warehouses/1');

    expect(req.request.method).toBe('PUT');

    req.flush(warehouse);

  });


  it('should delete a warehouse', () => {

    service.deleteWarehouse(1, 1).subscribe();

    let req = tester.expectOne('/api/companies/1/warehouses/1');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });


  it('should search warehouses', () => {

    const warehouses: Warehouse[] = [
      {
        id: 1,
        company: {
          id: 1
        } as Company,
        name: "Warehouse 1",
      },
      {
        id: 2,
        company: {
          id: 1
        } as Company,
        name: "Warehouse 2",
      },
      {
        id: 3,
        company: {
          id: 1
        } as Company,
        name: "Warehouse 3",
      }
    ];

    service.searchWarehouse('ware', 6).subscribe(ws => {
      expect(ws).toEqual(warehouses);
    });

    let req = tester.expectOne('/api/warehouses/search?q=ware&size=6');

    expect(req.request.method).toBe('GET');

    req.flush(warehouses);

  });


});
