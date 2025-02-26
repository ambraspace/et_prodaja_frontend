import { ToEuroPipe } from './to-euro.pipe';

describe('ToEuroPipe', () => {

  let pipe: ToEuroPipe;


  beforeEach(() => {
    pipe = new ToEuroPipe();
  });
  
  
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });


  it('can convert BAM to EUR', () => {
    const bamValue = 100;
    expect(pipe.transform(bamValue)).toEqual(bamValue/1.95583);
  });


  it('can convert negative values to EUR', () => {
    const bamValue = -100;
    expect(pipe.transform(bamValue)).toEqual(bamValue/1.95583);
  });


  it('can convert 0 to 0', () => {
    const bamValue = 0;
    expect(pipe.transform(bamValue)).toEqual(bamValue/1.95583);
  });


});
