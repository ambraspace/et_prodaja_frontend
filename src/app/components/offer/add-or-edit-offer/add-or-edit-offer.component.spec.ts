import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditOfferComponent } from './add-or-edit-offer.component';

describe('AddOrEditOfferComponent', () => {
  let component: AddOrEditOfferComponent;
  let fixture: ComponentFixture<AddOrEditOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditOfferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
