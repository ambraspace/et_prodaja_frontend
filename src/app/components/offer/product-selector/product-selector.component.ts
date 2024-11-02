import { Component, Input, OnInit } from '@angular/core';
import { ProductListComponent } from "../../product/product-list/product-list.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductFilter } from '../../../model/product-filter';
import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product.service';
import { RouterLink } from '@angular/router';
import { Item } from '../../../model/item';
import { ItemService } from '../../../services/item.service';
import { QuantityDialogComponent } from '../quantity-dialog/quantity-dialog.component';
import { StockInfo } from '../../../model/stock-info';

@Component({
  selector: 'app-product-selector',
  standalone: true,
  imports: [
    ProductListComponent,
    MatDialogModule,
    RouterLink
  ],
  templateUrl: './product-selector.component.html',
  styleUrl: './product-selector.component.css'
})
export class ProductSelectorComponent implements OnInit {

  
  constructor(
    private productService: ProductService,
    private itemService: ItemService,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
    let pf = sessionStorage.getItem('productFilter');
    if (pf)
      this.productFilter = new ProductFilter(pf);
    this.loadItems();
  }


  @Input("id")
  offerId?: string;


  selectedProduct?: Product;


  items: Item[] = [];


  productFilter = new ProductFilter();


  loadItems(): void
  {
    this.itemService.getOfferItems(this.offerId!).subscribe(is => {
      this.items = is;
    })
  }


  openQuantityDialog(p: Product)
  {
    this.selectedProduct = p;

    let dialogRef = this.dialog.open<QuantityDialogComponent, any, Map<StockInfo, number>>(
      QuantityDialogComponent,
      {data: {product: this.selectedProduct}}
    );
    dialogRef.afterClosed().subscribe(res => {
      if (res)
      {
        let items: Item[] = [];
        res.forEach((v,k,m) => {
          let i:Item = {
            discountPercent: 0,
            grossPrice: this.selectedProduct!.price,
            productName: this.selectedProduct!.name,
            preview: this.getDefaultPreviewImage(this.selectedProduct),
            quantity: v,
            stockInfo: k
          }
          items.push(i);
        });
        this.itemService.addItems(this.offerId!, items).subscribe(newItems => {
          this.items.push(...newItems);
          this.filterProducts(this.productFilter);
        })
      }
      this.selectedProduct = undefined;
    });
  }


  getDefaultPreviewImage(product?: Product): string
  {
    if (product && product.previews && product.previews.length > 0)
    {
      let preview = product.previews.find(pr => pr.primary == true);
      if (preview)
        return preview.fileName;
      if (product.previews.length > 0)
        return product.previews[0].fileName;
    }
    return "";
  }


  filterProducts = (pf: ProductFilter) =>
  {
      if (pf)
      {
        
        let newFilter = new ProductFilter();
        newFilter.query = pf.query;
        newFilter.searchComments = pf.searchComments;
        newFilter.warehouseId = pf.warehouseId;
        newFilter.tags = pf.tags;
        newFilter.categoryId = pf.categoryId;
      
        if (!this.productFilter.equals(pf))
        {
          this.productService.page = 0;
          sessionStorage.setItem('productFilter', JSON.stringify(newFilter));
        }

        this.productFilter = newFilter;
      
      }
  }


}
