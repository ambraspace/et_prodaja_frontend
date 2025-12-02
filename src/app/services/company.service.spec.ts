import { TestBed } from '@angular/core/testing';

import { CompanyService } from './company.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Company } from '../model/company';
import { Page } from '../model/page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CompanyService', () => {

  let service: CompanyService;
  let tester: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(CompanyService);
    tester = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    tester.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('can add company', () => {

    let testCompany: Company = {
      id: 1,
      name: "Test company",
      locality: "Some great city"
    };

    let retVal: Company = {} as Company;

    service.addCompany(testCompany).subscribe(c => {
      retVal = c;
    });

    const req = tester.expectOne('/api/companies');

    expect(req.request.method).toBe('POST');

    req.flush(testCompany);

    expect(testCompany).toEqual(retVal);

  });

  it('can delete a company', () => {

    service.deleteCompany(1).subscribe(() => {});

    let req = tester.expectOne('/api/companies/1');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });

  it('can get companies', () => {

    const testPage: Page<Company> = {
      page: {
        number: 1,
        size: 10,
        totalElements: 42,
        totalPages: 5
      },
      content: [
        {
          id: 1,
          name: "Test company 1",
          locality: "Some great city"
        },
        {
          id: 2,
          name: "Test company 2",
          locality: "Some great city"
        },
        {
          id: 3,
          name: "Test company 3",
          locality: "Some other great city"
        }
      ]
    };
    
    let retVal: Page<Company> = {} as Page<Company>;

    service.getCompanies().subscribe(c => {
      retVal = c;
    });

    let req = tester.expectOne('/api/companies?page=0&size=10&sort=name,ASC');

    expect(req.request.method).toBe('GET');

    req.flush(testPage);

    expect(retVal).toEqual(testPage);

  });

  it('can get specific company', () => {

    const testCompany: Company = {
      id: 1,
      name: "Test company 1",
      locality: "Some great city"
    };

    let retVal: Company = {} as Company;

    service.getCompany(1).subscribe(c => {
      retVal = c;
    });

    let req = tester.expectOne("/api/companies/1");

    expect(req.request.method).toBe("GET");

    req.flush(testCompany);

    expect(retVal).toEqual(testCompany);

  });

  it('can search for companies', () => {

    const query = "test";
    const size = 5;

    const testCompanies: Company[] = [
      {
        id: 1,
        name: "Test company 1",
        locality: "Some great city"
      },
      {
        id: 2,
        name: "Test company 2",
        locality: "Some great city"
      },
      {
        id: 3,
        name: "Test company 3",
        locality: "Some other great city"
      }
    ];

    const page: Page<Company> = {
      page: {
        number: 1,
        size: 5,
        totalElements: 100,
        totalPages: 5
      },
      content: testCompanies
    }

    let retVal: Company[] = []

    service.searchCompanies(query, size).subscribe(cs => {
      retVal = cs;
    });

    let req = tester.expectOne('/api/companies?q=test&size=5');

    expect(req.request.method).toBe('GET');

    req.flush(page);

    expect(retVal).toEqual(testCompanies);

  });

  it('can update company data', () => {

    const testCompany: Company = {
      id: 1,
      name: "Test company 1",
      locality: "Some great city"
    };

    let retVal: Company = {} as Company;

    service.updateCompany(1, testCompany).subscribe(c => {
      retVal = c;
    });

    let req = tester.expectOne("/api/companies/1");

    expect(req.request.method).toBe("PUT");

    req.flush(testCompany);

    expect(retVal).toEqual(testCompany);

  });
  
});
