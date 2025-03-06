import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JWToken } from '../model/jwt-token';
import { Router } from '@angular/router';

describe('AuthenticationService', () => {


  let service: AuthService;
  let tester: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    tester = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    tester.verify();
  });


  it('should be created', () => {
    service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });


  it('should keep JWT == null when there\'s no JWT in localStorate', () => {
    service = TestBed.inject(AuthService);
    expect(service.getToken()).toBe(null);
  });


  it('should retrieve JWT from localStorage', () => {

    localStorage.setItem('JWT', JSON.stringify({
      username: "user",
      jwttoken: "TEST JWT",
      role: "USER",
      exp: '2025-02-27'
    } as JWToken))

    service = TestBed.inject(AuthService);

    expect(service.getToken()).withContext('JWT is in localStorage').toBeTruthy();
    expect(service.getToken()!.jwttoken).withContext('JWT is the one we set in localStorage').toBe('TEST JWT');

    localStorage.removeItem('JWT');

  });


  it('should save JWT to localStorage', () => {

    service = TestBed.inject(AuthService);

    const token: JWToken = {
      username: "user",
      jwttoken: "TEST JWT",
      role: "USER",
      exp: '2025-02-27'
    };

    service.setToken(token);

    expect(localStorage.getItem('JWT')).withContext('JWT in localStorage should be present').toBeTruthy();

    expect(JSON.parse(localStorage.getItem('JWT')!)).withContext('JWT from localStorage should be the one we set').toEqual(token);

    localStorage.removeItem('JWT');

  });


  it('should try to authenticate', () => {
    
    service = TestBed.inject(AuthService);

    const username = 'user';
    const password = 'pass';

    let jwt: JWToken = {} as JWToken;

    service.authenticate(username, password).subscribe(token => {
      jwt = token;
    })

    const req = tester.expectOne('/api/authenticate');

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual({username: username, password: password});

    const retVal: JWToken = {
      username: "user",
      jwttoken: "TEST JWT",
      role: "USER",
      exp: '2025-02-27'
    };

    req.flush(retVal);

    expect(retVal).toEqual(jwt);

  });


  it('should try to refresh the token', () => {

    service = TestBed.inject(AuthService);

    let jwt: JWToken = {} as JWToken;

    service.refreshToken().subscribe(token => {
      jwt = token;
    })

    const req = tester.expectOne('/api/refreshtoken');

    expect(req.request.method).toBe('GET');

    const retVal: JWToken = {
      username: "user",
      jwttoken: "TEST JWT",
      role: "USER",
      exp: '2025-02-27'
    };

    req.flush(retVal);

    expect(retVal).toEqual(jwt);

  });


  it('should log off', () => {

    service = TestBed.inject(AuthService);

    const token: JWToken = {
      username: "user",
      jwttoken: "TEST JWT",
      role: "USER",
      exp: '2025-02-27'
    };

    service.setToken(token); // this sets both local variable and saves the token to localStorage

    service.logout();

    expect(service.getToken()).withContext('local variable set to null').toBeNull();

    expect(localStorage.getItem('JWT')).withContext('localStorage cleared').toBeNull();

  });


});
