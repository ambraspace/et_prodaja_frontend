import { OfferStatus } from '../model/offer-status';
import { OfferStatusLocalizePipe } from './offer-status-localize.pipe';

describe('OfferStatusLocalizePipe', () => {


  let pipe: OfferStatusLocalizePipe;


  beforeEach(() => {
    pipe = new OfferStatusLocalizePipe();
  });


  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });


  it('test all possible values', () => {

    let status: OfferStatus = 'ACCEPTED';
    expect(pipe.transform(status)).withContext('ACCEPTED status test').toBe("prihvaćena");

    status = 'ACTIVE';
    expect(pipe.transform(status)).withContext('ACTIVE status test').toBe("aktivna");

    status = 'CANCELED';
    expect(pipe.transform(status)).withContext('CANCELED status test').toBe("otkazana");

  });


});
