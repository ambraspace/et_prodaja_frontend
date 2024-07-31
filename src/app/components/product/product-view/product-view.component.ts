import { Component, OnDestroy, OnInit } from '@angular/core';
import { Page } from '../../../model/page';
import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product.service';
import { AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { debounceTime, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { Tag } from '../../../model/tag';
import { ProductFilterComponent } from '../product-filter/product-filter.component';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [
    NgFor,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    CurrencyPipe,
    AsyncPipe,
    ToEuroPipe,
    MatBadgeModule,
    MatPaginator,
    RouterLink
  ],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit, OnDestroy {

  destroyed = new Subject<void>();

  numColumnsMap = new Map(
    [
      [Breakpoints.XSmall, 2],
      [Breakpoints.Small, 4],
      [Breakpoints.Medium, 5],
      [Breakpoints.Large, 7],
      [Breakpoints.XLarge, 8]
    ]
  )

  numColums: number = 5;

  private pageSizeOptionsMultiplicators: number[] = [
    2, 5, 10, 20, 50
  ]

  pageSizeOptions = this.pageSizeOptionsMultiplicators;

  constructor(
    private productService: ProductService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  
  // Query parameters
  private q?: string;
  private cm?: boolean;
  private w?: number;
  private t: string[] = [];
  private ct?: number;


  filterApplied(): boolean
  {
    if (this.q || this.cm || this.w || this.t.length > 0 || this.ct)
      return true;
    return false;
  }
  
  
  productPage?: Page<Product>


  /*
    Ovo je ubačeno da se ne učitavaju proizvodi dva puta za redom.
  */
  private productsLoadSubject: Subject<string> = new Subject<string>();

  productObservable$ = this.productsLoadSubject.pipe(
    debounceTime(200),
    switchMap(() => this.productService.getProducts(
      this.q, this.cm, this.w, this.t, this.ct
    )
  ))


  ngOnInit(): void {

    this.breakpointObserver.observe(
      [
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ]
    )
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.numColums = this.numColumnsMap.get(query) ?? 5;
          this.productService.size = this.productService.rowCount * this.numColums;
          this.pageSizeOptions = this.pageSizeOptionsMultiplicators.map(psom => psom * this.numColums);
          this.loadProducts();
        }
      }
    });

    this.route.queryParams.subscribe(pm => {
      this.q = pm['q'];
      this.cm = pm['cm'];
      this.w = pm['w'];
      if (typeof pm['t'] === 'string')
      {
        this.t = Array.of(pm['t']);
      } else if (typeof pm['t'] === 'object') {
        this.t = pm['t'];
      } else {
        this.t = [];
      }
      this.ct = pm['ct'];
      this.loadProducts();
    });

  }


  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  
  loadProducts()
  {
    this.productsLoadSubject.next("PING");
    if (this.productObservable$)
    {
      let s = this.productObservable$.subscribe(p => {
        this.productPage = p;
        s.unsubscribe();
      });
    }
  }


  getDefaultPreviewImage(product: Product): string
  {
    if (product && product.previews && product.previews.length > 0)
    {
      let preview = product.previews.find(pr => pr.primary == true);
      if (preview)
        return "/api/files?fn=" + preview.fileName;
      if (product.previews.length > 0)
        return "/api/files?fn=" + product.previews[0].fileName;
    }
    return "/assets/no-image.jpg";
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


  updatePage(event: any)
  {
    if (this.productService.page != event.pageIndex ||
      this.productService.size != event.pageSize)
    {
      let numCols = this.productService.size / this.productService.rowCount;
      this.productService.page = event.pageIndex;
      this.productService.size = event.pageSize;
      this.productService.rowCount = this.productService.size / numCols;
      this.loadProducts();
    }
  }


  tagsSerialized(tags: Tag[]): string
  {
    return tags.map(t => t.name).join(', ');
  }


  openFilter(): void
  {

    let dialogRef = this.dialog.open(ProductFilterComponent, {data: {
      query: this.q,
      searchComments: this.cm,
      warehouseId: this.w,
      tags: this.t,
      categoryId: this.ct
    }});

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.q = result['query'];
        this.cm = result['searchComments'];
        this.w = result['warehouseId'];
        this.t = result['tags'];
        this.ct = result['categoryId'];
        let url: string = "/products";
        url = url + "?";
        if (this.q) {
          url = url + `q=${encodeURI(this.q)}&`;
          if (this.cm) url = url + `cm=${this.cm}&`;
        } else {
          this.cm = undefined;
        }
        if (this.w) url = url + `w=${this.w}&`;
        if (this.t && this.t.length > 0)
        {
          this.t.forEach(tag => url = url + `t=${encodeURI(tag)}&`)
        }
        if (this.ct) url = url + `ct=${this.ct}&`;
        if (url.charAt(url.length - 1) === '&' || url.charAt(url.length - 1) === '?')
          url = url.substring(0, url.length - 1);
        this.router.navigateByUrl(url, {replaceUrl: true});
        this.productService.page = 0;
      }
    });


  }

}
