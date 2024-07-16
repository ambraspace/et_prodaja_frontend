import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toEuro',
  standalone: true
})
export class ToEuroPipe implements PipeTransform {

  transform(value: number): number {

    if (value)
    {
      return value / 1.95583;
    }

    return 0;

  }

}
