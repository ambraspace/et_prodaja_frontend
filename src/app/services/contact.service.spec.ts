import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { Contact } from '../model/contact';
import { AuthService } from './auth.service';
import { JWToken } from '../model/jwt-token';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ContactService', () => {


  let service: ContactService;
  let testing: HttpTestingController;


  beforeEach(() => {

    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(ContactService); 
    testing = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    testing.verify();
  })


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('can get company contacts', () => {

    const testContacts: Contact[] = [
      {
        id: 1,
        name: "User 1",
        comment: "",
        email: "test1@email.com",
        phone: "111111"
      },
      {
        id: 2,
        name: "User 2",
        comment: "",
        email: "test2@email.com",
        phone: "222222"
      },
      {
        id: 3,
        name: "User 3",
        comment: "",
        email: "test3@email.com",
        phone: "333333"
      }
    ];

    service.getContacts(1)
      .subscribe(data =>
        expect(data).toEqual(testContacts)
      );
  
    const req = testing.expectOne('/api/companies/1/contacts');
  
    expect(req.request.method).toEqual('GET');

    req.flush(testContacts);
  
  });


  it('can get single contact', () => {

    let retVal: Contact = {
      id: 5,
      name: "User",
      comment: "",
      email: "test@email.com",
      phone: "123456"
    };
  
    service.getContact(1, 5)
      .subscribe(data =>
        expect(data).toEqual(retVal)
      );
  
    const req = testing.expectOne('/api/companies/1/contacts/5');
  
    expect(req.request.method).toEqual('GET');
  
    req.flush(retVal);
  
  });


  it('can add new contact', () => {

    let retVal: Contact = {
      id: 0,
      name: "User",
      comment: "",
      email: "test@email.com",
      phone: "123456"
    };
  
    service.addContact(1, retVal)
      .subscribe(data =>
        expect(data).toEqual(retVal)
      );
  
    const req = testing.expectOne('/api/companies/1/contacts');
  
    expect(req.request.method).toEqual('POST');
  
    req.flush(retVal);
  
  });


  it('can update existing contact', () => {

    let retVal: Contact = {
      id: 5,
      name: "User",
      comment: "",
      email: "test@email.com",
      phone: "123456"
    };
  
    service.updateContact(1, 5, retVal)
      .subscribe(data =>
        expect(data).toEqual(retVal)
      );
  
    const req = testing.expectOne('/api/companies/1/contacts/5');
  
    expect(req.request.method).toEqual('PUT');
  
    req.flush(retVal);
  
  });


  it('can delete existing contact', () => {

    service.deleteContact(1, 5)
      .subscribe();
  
    const req = testing.expectOne('/api/companies/1/contacts/5');
  
    expect(req.request.method).toEqual('DELETE');
  
    req.flush(null);
  
  });


});
