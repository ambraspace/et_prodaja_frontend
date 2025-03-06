import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController, RequestMatch } from '@angular/common/http/testing';
import { User } from '../model/user';
import { Page } from '../model/page';
import { Company } from '../model/company';

describe('UserService', () => {


  let service: UserService;
  let testing: HttpTestingController;


  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(UserService);
    testing = TestBed.inject(HttpTestingController);

  });


  afterEach(() => {
    testing.verify();
  })


  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('can get all users', () => {

    let page: Page<User> = {
      page: {
        number: 1,
        size: 12,
        totalElements: 123,
        totalPages: 11
      },
      content: [
        {
          username: "user1",
          canViewPrices: true,
          company: {
            id: 1
          } as Company,
          email: "mail1@domain.com",
          fullName: "John Doe",
          role: "USER"
        } as User,
        {
          username: "user2",
          canViewPrices: false,
          company: {
            id: 2
          } as Company,
          email: "mail2@domain.com",
          fullName: "Jane Doe",
          role: "ADMIN"
        } as User,
        {
          username: "user3",
          canViewPrices: true,
          company: {
            id: 3
          } as Company,
          email: "mail3@domain.com",
          fullName: "Peter Pan",
          role: "USER"
        } as User
      ]
    };
  
    service.getUsers()
      .subscribe(data =>
        expect(data).toEqual(page)
      );
  
    const req = testing.expectOne('/api/users?page=0&size=10&sort=username,ASC');

    expect(req.request.method).toBe('GET');

    req.flush(page);
  
  });


  it('should get a user by username', () => {

    const user: User = {
      username: "user1",
      canViewPrices: true,
      company: {
        id: 1
      } as Company,
      email: "mail1@domain.com",
      fullName: "John Doe",
      role: "USER"
    } as User;

    service.getUser('user1').subscribe(u => {
      expect(u).toEqual(user);
    });
    
    let req = testing.expectOne('/api/users/user1');

    expect(req.request.method).toBe('GET');

    req.flush(user);

  });


  it('should get logged in user', () => {

    const user: User = {
      username: "user1",
      canViewPrices: true,
      company: {
        id: 1
      } as Company,
      email: "mail1@domain.com",
      fullName: "John Doe",
      role: "USER"
    } as User;

    service.getUser().subscribe(u => {
      expect(u).toEqual(user);
    });
    
    let req = testing.expectOne('/api/user');

    expect(req.request.method).toBe('GET');

    req.flush(user);

  });


  it('should add new user', () => {

    const user: User = {
      username: "user1",
      canViewPrices: true,
      company: {
        id: 1
      } as Company,
      email: "mail1@domain.com",
      fullName: "John Doe",
      role: "USER"
    } as User;

    service.addUser(user).subscribe(u => {
      expect(u).toEqual(user);
    });

    let req = testing.expectOne('/api/users');

    expect(req.request.method).toBe('POST');

    req.flush(user);

  });


  it('should update existing user', () => {

    const user: User = {
      username: "user1",
      canViewPrices: true,
      company: {
        id: 1
      } as Company,
      email: "mail1@domain.com",
      fullName: "John Doe",
      role: "USER"
    } as User;

    service.updateUser("user1", user).subscribe(u => {
      expect(u).toEqual(user);
    });

    let req = testing.expectOne('/api/users/user1');

    expect(req.request.method).toBe('PUT');

    req.flush(user);

  });


  it('should delete existing user', () => {

    service.deleteUser("user1").subscribe();

    let req = testing.expectOne('/api/users/user1');

    expect(req.request.method).toBe('DELETE');

    req.flush(null);

  });


});
