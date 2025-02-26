import { OrderStatus } from '../model/order-status';
import { OrderStatusLocalizePipe } from './order-status-localize.pipe';

describe('OrderStatusLocalizePipe', () => {


  let pipe: OrderStatusLocalizePipe;


  beforeEach(() => {
    pipe = new OrderStatusLocalizePipe();
  });


  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });


  it('test all possible values', () => {

    let status: OrderStatus = 'CLOSED';
    expect(pipe.transform(status)).withContext('CLOSED status test').toBe("zatvorena");

    status = "OPEN";
    expect(pipe.transform(status)).withContext('OPEN status test').toBe("otvorena");

  });


});
