import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Category } from '../model/category';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CategoryService', () => {

  let service: CategoryService;
  let tester: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(CategoryService);
    tester = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    tester.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all categories', () => {

    let testCats: Category[] = [
      {
        id: 1,
        name: "Category 1",
        children: []
      },
      {
        id: 2,
        name: "Category 2",
        children: [
          {
            id: 3,
            name: "Category 3",
            children: []
          }
        ]
      }
    ]

    let retVal: Category[] = [];

    service.getCategories().subscribe(cats => {
      retVal = cats;
    });

    let req = tester.expectOne('/api/categories');

    expect(req.request.method).toBe('GET');

    req.flush(testCats);

    expect(retVal).toEqual(testCats);

  });

  it('should save categories', () => {

    let testCats: Category[] = [
      {
        id: 1,
        name: "Category 1",
        children: []
      },
      {
        id: 2,
        name: "Category 2",
        children: [
          {
            id: 3,
            name: "Category 3",
            children: []
          }
        ]
      }
    ]

    let retVal: Category[] = [];

    service.saveCategories(testCats).subscribe(cats => {
      retVal = cats;
    });

    let req = tester.expectOne('/api/categories');

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(testCats);

    req.flush(testCats);

    expect(retVal).toEqual(testCats);

  });
});
