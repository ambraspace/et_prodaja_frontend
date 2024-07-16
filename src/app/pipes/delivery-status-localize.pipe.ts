import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryStatus } from '../model/delivery-status';

@Pipe({
  name: 'deliveryStatusLocalize',
  standalone: true
})
export class DeliveryStatusLocalizePipe implements PipeTransform {

  transform(value: DeliveryStatus): string {
    switch (value)
    {
      case 'DELIVERED':
        return "isporučeno";
      case 'ON_THE_WAY':
        return 'u transportu';
      default:
        return 'GREŠKA!';
    }
  }

}
