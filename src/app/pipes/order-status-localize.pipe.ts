import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../model/order-status';

@Pipe({
  name: 'orderStatusLocalize',
  standalone: true
})
export class OrderStatusLocalizePipe implements PipeTransform {

  transform(value: OrderStatus): string {
    if (value === 'OPEN')
      return 'otvorena';
    else if (value === 'CLOSED')
      return 'zatvorena';
    else
      return 'GREŠKA!';
  }

}
