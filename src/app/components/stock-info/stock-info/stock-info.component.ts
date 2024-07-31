import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { StockInfoService } from '../../../services/stock-info.service';
import { Page } from '../../../model/page';
import { StockInfo } from '../../../model/stock-info';
import { CurrencyPipe, DatePipe, DecimalPipe, NgIf, PercentPipe } from '@angular/common';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';
import { AddOrEditStockInfoComponent } from '../add-or-edit-stock-info/add-or-edit-stock-info.component';

@Component({
  selector: 'app-stock-info',
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatDialogModule,
    MatPaginator,
    MatTableModule,
    DatePipe, ToEuroPipe, CurrencyPipe, DecimalPipe, PercentPipe
  ],
  templateUrl: './stock-info.component.html',
  styleUrl: './stock-info.component.css'
})
export class StockInfoComponent {


  constructor(
    private stockInfoService: StockInfoService,
    private dialog: MatDialog
  ) {}


  @Input()
  set productId(id: number | undefined)
  {
    this._productId = id;
    this.loadStockInfo();
  }


  loadStockInfo(): void
  {
    if (this._productId)
    {
      this.stockInfoService.getStockInfosByProduct(this._productId)
        .subscribe(sis => this.stockInfoPage = sis)
    }
  }


  private _productId?: number;


  stockInfoPage ?: Page<StockInfo>;


  get stockInfoList(): StockInfo[]
  {
    if (this.stockInfoPage)
      return this.stockInfoPage.content;
    return [];
  }


  displayedColumns = ['warehouse', 'customerReference', 'quantity', 'unitPrice', 'actions'];


  updateTable(event: any): void
  {
    this.stockInfoService.page = event.pageIndex;
    this.stockInfoService.size = event.pageSize;
    this.loadStockInfo();
  }


  addStockInfo(): void
  {

    let dialogRef = this.dialog.open<AddOrEditStockInfoComponent, any, StockInfo>(
      AddOrEditStockInfoComponent, {data: {productId: this._productId, stockInfo: undefined}, width: "400px"});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadStockInfo();
      }
    })

  }


  editStockInfo(si: StockInfo): void
  {

    let dialogRef = this.dialog.open<AddOrEditStockInfoComponent, any, StockInfo>(
      AddOrEditStockInfoComponent, {data: {productId: this._productId, stockInfo: si}, width: "400px"});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.loadStockInfo();   
      }
    })

  }


  deleteStockInfo(id: number): void
  {

    let dialogRef = this.dialog.open(YesNoDialogComponent, {data: "Želite li da obrišete količinu?"});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.stockInfoService.deleteStockInfo(this._productId!, id).subscribe(() => this.loadStockInfo());      
      }
    });

  }
}
