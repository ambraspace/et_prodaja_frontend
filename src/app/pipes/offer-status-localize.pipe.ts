import { Pipe, PipeTransform } from '@angular/core';
import { OfferStatus } from '../model/offer-status';

@Pipe({
  name: 'offerStatusLocalize',
  standalone: true
})
export class OfferStatusLocalizePipe implements PipeTransform {

  transform(value: OfferStatus): string {
    switch (value)
    {
      case 'ACCEPTED':
        return 'prihvaćena';
      case 'ACTIVE':
        return 'aktivna';
      case 'CANCELED':
        return 'otkazana';
      default:
        return 'GREŠKA!';
    }
  }

}
