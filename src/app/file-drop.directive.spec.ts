import { ElementRef, inject } from '@angular/core';
import { FileDropDirective } from './file-drop.directive';

describe('FileDropDirective', () => {

  it('should create an instance', () => {
    let el = inject(ElementRef);
    const directive = new FileDropDirective(el);
    expect(directive).toBeTruthy();
  });
});
