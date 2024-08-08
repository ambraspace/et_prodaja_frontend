import { Component, Inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel} from '@angular/material/input';
import { Warehouse } from '../../../model/warehouse';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { WarehouseService } from '../../../services/warehouse.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StockInfo } from '../../../model/stock-info';
import { StockInfoService } from '../../../services/stock-info.service';

@Component({
  selector: 'app-add-or-edit-stock-info',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormField, MatLabel, MatSelect, MatOption, MatInput
  ],
  templateUrl: './add-or-edit-stock-info.component.html',
  styleUrl: './add-or-edit-stock-info.component.css'
})
export class AddOrEditStockInfoComponent implements OnInit {


  constructor(
    private warehouseService: WarehouseService,
    private stockInfoService: StockInfoService,
    private dialogRef: MatDialogRef<AddOrEditStockInfoComponent, StockInfo>,
    @Inject(MAT_DIALOG_DATA)
    private data: {productId: number, stockInfo: StockInfo}
  ) {
    if (data.stockInfo)
    {
      this.stockInfoForm.patchValue(data.stockInfo);
      this.stockInfoForm.get('warehouse')?.disable();
    }
  }


  stockInfoForm: FormGroup = new FormGroup({
    warehouse: new FormControl<Warehouse>({} as Warehouse, [Validators.required]),
    customerReference: new FormControl<string>('', [Validators.minLength(2), Validators.maxLength(255)]),
    quantity: new FormControl<number>(0, [Validators.min(0)]),
    unitPrice: new FormControl<number>(0, [Validators.min(0)]),
    repairableQuantity: new FormControl<number>(0),
  })


  warehouses$!: Observable<Warehouse[]>;


  private searchText$ = new Subject<string>();


  ngOnInit(): void {
    this.warehouses$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query =>
        this.warehouseService.searchWarehouse(query, 5))
    );
  }


  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }


  search(packageName: string) {
    this.searchText$.next(packageName);
  }


  warehouseToWarehouseName(w: Warehouse): string
  {
    if (w && w.company)
      return `${w.name} (${w.company.name} - ${w.company.locality})`;

    return "";
  }


  cancel(): void
  {
    this.dialogRef.close();
  }


  save(): void
  {

    if (this.data.stockInfo)
    {
      this.stockInfoService.updateStockInfo(this.data.productId, this.data.stockInfo.id, this.stockInfoForm.value)
        .subscribe(si => this.dialogRef.close(si))
    } else {
      this.stockInfoService.addStockInfo(this.data.productId, this.stockInfoForm.value)
        .subscribe(si => this.dialogRef.close(si))
    }

  }


}
