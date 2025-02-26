import { UserRolePipe } from './user-role.pipe';
import { UserRole } from '../model/user-role';

describe('UserRolePipe', () => {


  let pipe: UserRolePipe;


  beforeEach(() => {
    pipe = new UserRolePipe();
  });


  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });


  it('test all possible values', () => {

    let role: UserRole = "ADMIN";
    expect(pipe.transform(role)).withContext('ADMIN test').toBe("Administrator");

    role = "USER";
    expect(pipe.transform(role)).withContext('USER test').toBe("Korisnik");

    role = "CUSTOMER";
    expect(pipe.transform(role)).withContext('ADMIN test').toBe("Kupac");

  });


});
