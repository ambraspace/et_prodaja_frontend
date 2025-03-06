import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Page } from '../model/page';
import { Product } from '../model/product';
import { Category } from '../model/category';

describe('ProductService', () => {


  let service: ProductService;
  let tester: HttpTestingController;


  beforeEach(() => {
  
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ProductService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return a page of products', () => {

    const page: Page<Product> = {
      page: {
        number: 0,
        size: 10,
        totalElements: 112,
        totalPages: 12
      },
      content: [
        {
          id: 1,
          category: {
            id: 1,
            name: "Category 1"
          } as Category,
          name: "Product 1",
          previews: [
            {
              id: 1,
              fileName: "giberish1.jpg",
              size: 20000,
              primary: false,
              originalFileName: "img1.jpg"
            }
          ],
          price: 3.14,
          unit: "pcs.",
          tags: []
        },
        {
          id: 2,
          category: {
            id: 2,
            name: "Category 2"
          } as Category,
          name: "Product 2",
          previews: [
            {
              id: 2,
              fileName: "giberish2.jpg",
              size: 30000,
              primary: false,
              originalFileName: "img2.jpg"
            }
          ],
          price: 3.24,
          unit: "pcs.",
          tags: []
        },
        {
          id: 3,
          category: {
            id: 3,
            name: "Category 2"
          } as Category,
          name: "Product 3",
          previews: [
            {
              id: 3,
              fileName: "giberish3.jpg",
              size: 30000,
              primary: false,
              originalFileName: "img3.jpg"
            }
          ],
          price: 3.34,
          unit: "pcs.",
          tags: []
        }
      ]
    }

    service.getProducts("prod", true, 1, ["white", "red"], 3).subscribe(p => {
      expect(p).toEqual(page);
    });

    let req = tester.expectOne('/api/products?page=0&size=10&sort=category.order,name,id&q=prod&cm=true&w=1&t=white&t=red&ct=3');

    expect(req.request.method).toBe('GET');

    req.flush(page);

  });


  it('should return a product by its ID', () => {

    const product: Product = {
      id: 1,
      category: {
        id: 1,
        name: "Category 1"
      } as Category,
      name: "Product 1",
      previews: [
        {
          id: 1,
          fileName: "giberish1.jpg",
          size: 20000,
          primary: false,
          originalFileName: "img1.jpg"
        }
      ],
      price: 3.14,
      unit: "pcs.",
      tags: []
    };

    service.getProduct(1).subscribe(p => {
      expect(p).toEqual(product);
    });

    let req = tester.expectOne('/api/products/1');

    expect(req.request.method).toBe('GET');

    req.flush(product);

  });


  it('should add new product', () => {

    const product: Product = {
      id: 1,
      category: {
        id: 1,
        name: "Category 1"
      } as Category,
      name: "Product 1",
      previews: [
        {
          id: 1,
          fileName: "giberish1.jpg",
          size: 20000,
          primary: false,
          originalFileName: "img1.jpg"
        }
      ],
      price: 3.14,
      unit: "pcs.",
      tags: []
    };

    service.addProduct(product).subscribe(p => {
      expect(p).toEqual(product);
    });

    let req = tester.expectOne('/api/products');

    expect(req.request.method).toBe('POST');

    req.flush(product);

  });


  it('should update existing product', () => {

    const product: Product = {
      id: 1,
      category: {
        id: 1,
        name: "Category 1"
      } as Category,
      name: "Product 1",
      previews: [
        {
          id: 1,
          fileName: "giberish1.jpg",
          size: 20000,
          primary: false,
          originalFileName: "img1.jpg"
        }
      ],
      price: 3.14,
      unit: "pcs.",
      tags: []
    };

    service.updateProduct(1, product).subscribe(p => {
      expect(p).toEqual(product);
    });

    let req = tester.expectOne('/api/products/1');

    expect(req.request.method).toBe('PUT');

    req.flush(product);

  });


  it('should delete a product', () => {

    service.deleteProduct(1).subscribe();

    let req = tester.expectOne('/api/products/1');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });



});
