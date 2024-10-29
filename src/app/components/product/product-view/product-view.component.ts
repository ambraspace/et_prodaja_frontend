import { Component, OnInit } from '@angular/core';
import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { ProductListComponent } from "../product-list/product-list.component";
import { ProductFilter } from '../../../model/product-filter';
import { ProductPopupComponent } from '../product-popup/product-popup.component';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [
    MatButtonModule,
    ProductListComponent
],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit {


  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}


  productFilter: ProductFilter = {};


  ngOnInit(): void {
    this.route.queryParams.subscribe(pm => {
      let newProductFilter: ProductFilter = {};
      newProductFilter.query = pm['q'];
      newProductFilter.searchComments = pm['cm'];
      newProductFilter.warehouseId = pm['w'];
      if (typeof pm['t'] === 'string')
      {
        newProductFilter.tags = Array.of(pm['t']);
      } else if (typeof pm['t'] === 'object') {
        newProductFilter.tags = pm['t'];
      } else {
        newProductFilter.tags = [];
      }
      newProductFilter.categoryId = pm['ct'];
      this.productFilter = newProductFilter;
    });
  
  }


  showProductPage(p: Product)
  {
    let dialodRef = this.dialog.open<ProductPopupComponent, number, void>(
      ProductPopupComponent,
      {data: p.id, width: "600px"});
  }


  addProduct(): void
  {
    let dialogRef = this.dialog.open(AddProductComponent, {width: "700px", disableClose: true});
    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.router.navigateByUrl(`/products/${result}`);
      }
    })
  }


  filterProducts = (pf: ProductFilter) =>
  {
      if (pf)
      {
        let url: string = "/products";
        url = url + "?";
        if (pf.query) {
          url = url + `q=${encodeURI(pf.query)}&`;
          if (pf.searchComments) url = url + `cm=${pf.searchComments}&`;
        }
        if (pf.warehouseId) url = url + `w=${pf.warehouseId}&`;
        if (pf.tags && pf.tags.length > 0)
        {
          pf.tags.forEach(tag => url = url + `t=${encodeURI(tag)}&`)
        }
        if (pf.categoryId) url = url + `ct=${pf.categoryId}&`;
        if (url.charAt(url.length - 1) === '&' || url.charAt(url.length - 1) === '?')
          url = url.substring(0, url.length - 1);
        this.router.navigateByUrl(url, {replaceUrl: true});
      } else {
        this.router.navigateByUrl('/products', {replaceUrl: true});
      }
      this.productService.page = 0;

  }

}
