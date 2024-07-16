import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseViewComponent } from './warehouse-view.component';

describe('WarehouseViewComponent', () => {
  let component: WarehouseViewComponent;
  let fixture: ComponentFixture<WarehouseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarehouseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
