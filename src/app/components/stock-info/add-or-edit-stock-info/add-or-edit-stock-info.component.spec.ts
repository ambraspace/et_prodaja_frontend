import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditStockInfoComponent } from './add-or-edit-stock-info.component';

describe('AddOrEditStockInfoComponent', () => {
  let component: AddOrEditStockInfoComponent;
  let fixture: ComponentFixture<AddOrEditStockInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOrEditStockInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOrEditStockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
