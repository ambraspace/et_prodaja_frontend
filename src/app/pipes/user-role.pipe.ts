import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../model/user-role';

@Pipe({
  name: 'userRole',
  standalone: true
})
export class UserRolePipe implements PipeTransform {

  transform(value: UserRole): string {
    
    switch (value)
    {
      case 'ADMIN':
        return 'Administrator';
      case 'USER':
        return 'Korisnik';
      case 'CUSTOMER':
        return 'Kupac';
    }
  
  }

}
