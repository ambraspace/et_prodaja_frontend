import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputDialog } from './text-input-dialog.component';

describe('TextInputDialog', () => {
  let component: TextInputDialog;
  let fixture: ComponentFixture<TextInputDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputDialog]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextInputDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
