import { DeliveryStatus } from '../model/delivery-status';
import { DeliveryStatusLocalizePipe } from './delivery-status-localize.pipe';

describe('DeliveryStatusLocalizePipe', () => {

  let pipe: DeliveryStatusLocalizePipe;


  beforeEach(() => {
    pipe = new DeliveryStatusLocalizePipe();
  });


  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });


  it('test all possible values', () => {

    let status: DeliveryStatus = 'DELIVERED';
    expect(pipe.transform(status)).withContext('DELIVERED status test').toBe("isporučeno");

    status = "ON_THE_WAY";
    expect(pipe.transform(status)).withContext('ON_THE_WAY status test').toBe("u transportu");
    
  });


});
