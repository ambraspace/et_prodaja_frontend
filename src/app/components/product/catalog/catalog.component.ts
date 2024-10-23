import { Component, OnInit } from '@angular/core';
import { ProductListComponent } from "../product-list/product-list.component";
import { ProductFilter } from '../../../model/product-filter';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
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


  productFilter: ProductFilter = {};

  filterProducts = (pf: ProductFilter) =>
    {
        if (pf)
        {
          let url: string = "/catalog";
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
          this.router.navigateByUrl('/catalog', {replaceUrl: true});
        }
        this.productService.page = 0;
  
    }
  


}
