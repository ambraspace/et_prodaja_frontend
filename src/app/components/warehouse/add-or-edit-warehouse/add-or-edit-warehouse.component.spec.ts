import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditWarehouseComponent } from './add-or-edit-warehouse.component';

describe('AddOrEditWarehouseComponent', () => {
  let component: AddOrEditWarehouseComponent;
  let fixture: ComponentFixture<AddOrEditWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditWarehouseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
