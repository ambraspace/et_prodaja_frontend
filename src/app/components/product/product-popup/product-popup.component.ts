import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../model/product';
import { CurrencyPipe } from '@angular/common';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { StockInfoService } from '../../../services/stock-info.service';
import { Page } from '../../../model/page';
import { StockInfo } from '../../../model/stock-info';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-product-popup',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    RouterLink,
    CurrencyPipe, ToEuroPipe,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule
  ],
  templateUrl: './product-popup.component.html',
  styleUrl: './product-popup.component.css'
})
export class ProductPopupComponent implements OnInit {


  constructor(
    private dialogRef: MatDialogRef<ProductPopupComponent, void>,
    @Inject(MAT_DIALOG_DATA) private data: number,
    private router: Router,
    private productService: ProductService,
    private stockInfoService: StockInfoService
  ) {
    this.productId = data;
    this.stockInfoService.size = 5;
    this.stockInfoService.page = 0;
};


  productId?: number;


  product?: Product;


  selectedPreviewIndex = -1;


  stockInfoPage?: Page<StockInfo>


  displayedColumns = ['warehouse', 'qty', 'availableQty', 'purchasePrice'];


  get stockInfos(): StockInfo[]
  {
    if (this.stockInfoPage)
      return this.stockInfoPage.content;
    return [];
  }


  ngOnInit(): void {
    this.loadProduct();
  }


  loadProduct(): void
  {

    if (this.productId != undefined && this.productId > 0)
    {
      this.productService.getProduct(this.productId).subscribe(p => {
        this.selectedPreviewIndex = p.previews.findIndex(pr => pr.primary == true);
        this.product = p;
        this.loadStockInfo();
      })
    }

  }


  loadStockInfo(): void
  {
    if (this.product)
    {
      this.stockInfoService.getStockInfosByProduct(this.product.id!).subscribe(si => {
        this.stockInfoPage = si
      })
    }
  }


  getPreviewImage(): string
  {
    if (this.product && this.selectedPreviewIndex >= 0)
    {
      return `/api/images/${this.product.previews[this.selectedPreviewIndex].fileName}`;
    } else {
      return `/assets/no-image.jpg`;
    }
  }


  moveLeft(): void
  {
    if (this.product && this.product.previews && this.product.previews.length > 0)
    {
      this.selectedPreviewIndex --;
      if (this.selectedPreviewIndex < 0)
        this.selectedPreviewIndex = this.product.previews.length - 1;
    }
  }


  moveRight(): void
  {
    if (this.product && this.product.previews && this.product.previews.length > 0)
    {
      this.selectedPreviewIndex ++;
      if (this.selectedPreviewIndex >= this.product.previews.length)
        this.selectedPreviewIndex = 0;
    }
    }


  public openProductPage(): void
  {
    this.dialogRef.close();
    this.router.navigateByUrl("/products/" + this.productId);
  }


  tabChange($event: MatTabChangeEvent)
  {
    console.log($event.tab.textLabel);
    
  }


  updateTable(event: any): void
  {
    this.stockInfoService.page = event.pageIndex;
    this.stockInfoService.size = event.pageSize;
    this.loadStockInfo();
  }

}
