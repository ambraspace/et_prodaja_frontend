import { TestBed } from '@angular/core/testing';

import { OfferService } from './offer.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Offer } from '../model/offer';
import { Page } from '../model/page';
import { HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OfferService', () => {
  
  
  let service: OfferService;
  let tester: HttpTestingController;


  beforeEach(() => {
  
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(OfferService);
    tester = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return an offer', () => {

    const offer: Offer = {
      id: "OFFER_1",
      company: {
        id: 1,
        name: "My Company",
        locality: "Here"
      },
      offerDate: new Date("2025-03-01"),
      status: "ACTIVE",
      value: 100.0
    } as Offer;

    service.getOffer('OFFER_1').subscribe(o => {
      expect(o).toEqual(offer);
    });

    let req = tester.expectOne('/api/offers/OFFER_1');

    expect(req.request.method).toBe('GET');

    req.flush(offer);

  });


  it('should retrieve offers with multiple filter values', () => {
    
    const page: Page<Offer> = {
      page: {
        number: 0,
        size: 10,
        totalElements: 100,
        totalPages: 10
      },
      content: [
        {
          id: "OFFER_1",
          company: {
            id: 1,
            name: "My Company",
            locality: "Here"
          },
          offerDate: new Date("2025-03-01"),
          status: "ACTIVE",
          value: 100.0
        } as Offer,
        {
          id: "OFFER_2",
          company: {
            id: 1,
            name: "My Company 2",
            locality: "Here 2"
          },
          offerDate: new Date("2025-03-02"),
          status: "CANCELED",
          value: 200.0
        } as Offer,
        {
          id: "OFFER_3",
          company: {
            id: 1,
            name: "My Company 3",
            locality: "Here 3"
          },
          offerDate: new Date("2025-03-03"),
          status: "ACCEPTED",
          value: 300.0
        } as Offer  
      ]
    };

    service.getOffers('user', 12, ["ACTIVE", "CANCELED"], 42).subscribe(p => {
      expect(p).toEqual(page);
    });

    let req = tester.expectOne('/api/offers?page=0&size=10&sort=id,DESC&u=user&c=12&s=ACTIVE&s=CANCELED&p=42');

    expect(req.request.method).toBe('GET');

    req.flush(page);

  });


  it('should add new offer', () => {

    const offer: Offer = {
      id: "OFFER_1",
      company: {
        id: 1,
        name: "My Company",
        locality: "Here"
      },
      offerDate: new Date("2025-03-01"),
      status: "ACTIVE",
      value: 100.0
    } as Offer;

    service.addOffer(offer).subscribe(o => {
      expect(o).toEqual(offer);
    });

    let req = tester.expectOne('/api/offers');

    expect(req.request.method).toBe('POST');

    req.flush(offer);

  });


  it('should update offer', () => {

    const offer: Offer = {
      id: "OFFER_1",
      company: {
        id: 1,
        name: "My Company",
        locality: "Here"
      },
      offerDate: new Date("2025-03-01"),
      status: "ACTIVE",
      value: 100.0
    } as Offer;

    service.updateOffer("OFFER_1", offer).subscribe(o => {
      expect(o).toEqual(offer);
    });

    let req = tester.expectOne('/api/offers/OFFER_1');

    expect(req.request.method).toBe('PUT');

    req.flush(offer);

  });


  it('should delete offer', () => {

    service.deleteOffer("OFFER_1").subscribe();

    let req = tester.expectOne('/api/offers/OFFER_1');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });


  it('should cancel offer', () => {

    const offer: Offer = {
      id: "OFFER_1",
      company: {
        id: 1,
        name: "My Company",
        locality: "Here"
      },
      offerDate: new Date("2025-03-01"),
      status: "ACTIVE",
      value: 100.0
    } as Offer;

    service.cancelOffer("OFFER_1", "Expensive").subscribe(o => {
      expect(o).toEqual(offer)
    });

    let req = tester.expectOne('/api/offers/OFFER_1/cancel?r=Expensive');

    expect(req.request.method).toBe('PATCH');

    req.flush(offer);

  });


  it('should accept offer', () => {

    const offer: Offer = {
      id: "OFFER_1",
      company: {
        id: 1,
        name: "My Company",
        locality: "Here"
      },
      offerDate: new Date("2025-03-01"),
      status: "ACTIVE",
      value: 100.0
    } as Offer;

    service.acceptOffer("OFFER_1").subscribe(o => {
      expect(o).toEqual(offer)
    });

    let req = tester.expectOne('/api/offers/OFFER_1/accept');

    expect(req.request.method).toBe('PATCH');

    req.flush(offer);

  });


  it('should duplicate offer', () => {

    const offer: Offer = {
      id: "OFFER_1",
      company: {
        id: 1,
        name: "My Company",
        locality: "Here"
      },
      offerDate: new Date("2025-03-01"),
      status: "ACTIVE",
      value: 100.0
    } as Offer;

    service.duplicateOffer("OFFER_1").subscribe(o => {
      expect(o).toEqual(offer)
    });

    let req = tester.expectOne('/api/offers/OFFER_1/duplicate');

    expect(req.request.method).toBe('POST');

    req.flush(offer);

  });


  it('should download offer', () => {

    const file: Blob = new Blob(["BLOB"])

    service.downloadOffer("OFFER_1.pdf").subscribe(o => {
      expect(o.body).toBe(file);
    });

    let req = tester.expectOne('/api/files/offers/OFFER_1.pdf');

    expect(req.request.method).toBe('GET');

    req.flush(file);

  });


  it('should delete all offers', () => {

    service.deleteAllOffers().subscribe();

    let req = tester.expectOne('/api/offers/all');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });


});
