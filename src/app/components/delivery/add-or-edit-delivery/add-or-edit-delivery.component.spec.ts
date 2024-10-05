import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditDeliveryComponent } from './add-or-edit-delivery.component';

describe('AddOrEditDeliveryComponent', () => {
  let component: AddOrEditDeliveryComponent;
  let fixture: ComponentFixture<AddOrEditDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditDeliveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
