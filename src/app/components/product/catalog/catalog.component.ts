import { Component, OnInit } from '@angular/core';
import { ProductListComponent } from "../product-list/product-list.component";
import { ProductFilter } from '../../../model/product-filter';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ProductViewComponent } from '../product-view/product-view.component';

@Component({
    selector: 'app-catalog',
    imports: [ProductListComponent],
    templateUrl: './catalog.component.html',
    styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}


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
      this.productFilter = newProductFilter;
    });
  
  }


  productFilter = new ProductFilter();

  filterProducts = (pf: ProductFilter) =>
  {

    if (pf)
    {

      this.productService.page = 0;
    
      let url = ProductViewComponent.createUrlFromProductFilter(pf);

      url = url.replace("/products", "/catalog");

      this.router.navigateByUrl(url, {replaceUrl: true});

    } else {

      this.router.navigateByUrl('/catalog', {replaceUrl: true});
      
    }
  
  }
  


}
