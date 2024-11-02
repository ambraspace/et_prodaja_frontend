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


  productFilter = new ProductFilter();


  ngOnInit(): void {
    this.route.queryParams.subscribe(pm => {

      let newProductFilter = new ProductFilter();

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
      
      if (
        newProductFilter.query ||
        newProductFilter.warehouseId ||
        (newProductFilter.tags && newProductFilter.tags.length > 0) ||
        newProductFilter.categoryId
      )
      {
        sessionStorage.setItem('productFilter', JSON.stringify(newProductFilter));
        this.productFilter = newProductFilter;
      } else {
        let pf = sessionStorage.getItem('productFilter');
        if (pf)
        {
          this.productFilter = new ProductFilter(pf);
        } else {
          this.productFilter = newProductFilter;
        }
      }
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

      sessionStorage.setItem('productFilter', JSON.stringify(pf));
    
      this.productService.page = 0;
    
      let url = ProductViewComponent.createUrlFromProductFilter(pf);

      if (url == '/products')
      {
        /* the filter is reset */
        this.productFilter = new ProductFilter();
      }
      this.router.navigateByUrl(url, {replaceUrl: true});

    }

  }


  static createUrlFromProductFilter(pf: ProductFilter): string
  {

    let query = "";
    
    if (pf.query && pf.query.trim() != '')
    {
      query += `q=${encodeURI(pf.query)}&`;
      if (pf.searchComments) {
        query += `cm=true&`;
      }
    }

    if (pf.warehouseId)
    {
      query += `w=${pf.warehouseId}&`;
    }

    if (pf.tags && pf.tags.length > 0)
    {
      query += `t=` + (pf.tags.map(t => encodeURI(t)).join(`&t=`)) + `&`;
    }

    if (pf.categoryId)
    {
      query += `ct=${pf.categoryId}&`;
    }

    if (query.endsWith('&'))
      query = query.substring(0, query.length - 1);

    if (query.trim() == '')
      return '/products';
    else
      return `/products?${query}`;

  }


}
