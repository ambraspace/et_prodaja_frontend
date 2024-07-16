import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditContactComponent } from './add-or-edit-contact.component';

describe('AddOrEditContactComponent', () => {
  let component: AddOrEditContactComponent;
  let fixture: ComponentFixture<AddOrEditContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
