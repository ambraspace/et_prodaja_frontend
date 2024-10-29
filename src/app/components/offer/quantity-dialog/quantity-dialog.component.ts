import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../model/product';
import { StockInfoService } from '../../../services/stock-info.service';
import { StockInfo } from '../../../model/stock-info';
import { Page } from '../../../model/page';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { CurrencyPipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { AddOrEditStockInfoComponent } from '../../stock-info/add-or-edit-stock-info/add-or-edit-stock-info.component';

@Component({
  selector: 'app-quantity-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    ToEuroPipe, CurrencyPipe,
    MatInput
  ],
  templateUrl: './quantity-dialog.component.html',
  styleUrl: './quantity-dialog.component.css'
})
export class QuantityDialogComponent implements OnInit {

  constructor(
    private stockInfoService: StockInfoService,
    private dialogRef: MatDialogRef<QuantityDialogComponent, Map<StockInfo, number>>,
    @Inject(MAT_DIALOG_DATA) public data: {product: Product},
    private dialog: MatDialog
  ) {}


  stockInfoPage?: Page<StockInfo>;


  quantities: Map<StockInfo, number> = new Map();


  get stockInfoList(): StockInfo[]
  {
    if (this.stockInfoPage)
      return this.stockInfoPage.content;
    return [];
  }


  displayedColumns = ['warehouse', 'customerReference', 'quantity', 'availableQuantity', 'unitPrice', 'quantityForOffer'];


  ngOnInit(): void {
    this.loadStockInfo();    
  }


  loadStockInfo(): void
  {
    if (this.data.product && this.data.product.id)
    {
      this.stockInfoService.getStockInfosByProduct(this.data.product.id).subscribe(p => this.stockInfoPage = p)
    }
  }


  updateTable(event: any): void
  {
    this.stockInfoService.page = event.pageIndex;
    this.stockInfoService.size = event.pageSize;
    this.loadStockInfo();
  }


  quantityChanged(si: StockInfo, $event: any)
  {
    if ($event.target.value < 0)
      $event.target.value = 0;
    this.quantities.set(si, $event.target.value);
  }


  save(): void
  {
    let finalMap = new Map<StockInfo, number>();
    this.quantities.forEach((v,k,m) => {
      if (v > 0)
      {
        finalMap.set(k, v);
      }
    })
    this.dialogRef.close(finalMap);
  }


  addNewStockInfo(): void
  {
    let dialogRef = this.dialog.open<AddOrEditStockInfoComponent, any, StockInfo>(
      AddOrEditStockInfoComponent, {data: {productId: this.data.product.id, stockInfo: undefined}, width: "400px"});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadStockInfo();
      }
    })

  }


}
