import { AsyncPipe, CurrencyPipe, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, Subject, switchMap, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProductService } from '../../../services/product.service';
import { Page } from '../../../model/page';
import { Product } from '../../../model/product';
import { Tag } from '../../../model/tag';
import { ProductFilter } from '../../../model/product-filter';
import { RouterLink } from '@angular/router';
import { ProductFilterComponent } from "../product-filter/product-filter.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgFor,
    MatExpansionModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    CurrencyPipe,
    AsyncPipe,
    ToEuroPipe,
    MatBadgeModule,
    MatPaginator,
    RouterLink,
    ProductFilterComponent
],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {

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
    2, 5, 10, 20, 50, 100
  ]

  pageSizeOptions = this.pageSizeOptionsMultiplicators;

  constructor(
    private productService: ProductService,
    private breakpointObserver: BreakpointObserver
  ) { }


  @Input()
  get productFilter(): ProductFilter
  {
    if (this._productFilter)
    {
      return this._productFilter;
    } else {
      return {
        query: undefined,
        searchComments: false,
        warehouseId: undefined,
        tags: [],
        categoryId: undefined
      }
    }
  }
  set productFilter(pf: ProductFilter)
  {
    if (pf)
    {
      this._productFilter = {
        query: pf.query,
        searchComments: pf.searchComments,
        warehouseId: pf.warehouseId,
        tags: pf.tags,
        categoryId: pf.categoryId
      };
    } else {
      this._productFilter = {
        query: undefined,
        searchComments: false,
        warehouseId: undefined,
        tags: [],
        categoryId: undefined
      }
    }
    this.loadProducts();
  }

  private _productFilter?: ProductFilter;


  @Input()
  onProductFilter?: (filter: ProductFilter) => void;


  @Output() productSelected = new EventEmitter<Product>();


  productClick(p: Product): void
  {
    this.productSelected.emit(p);
  }


  filterApplied(): boolean
  {
    if (
      this.productFilter.query ||
      this.productFilter.searchComments ||
      this.productFilter.warehouseId ||
      (this.productFilter.tags && this.productFilter.tags.length > 0) ||
      this.productFilter.categoryId
    )
      return true;
    return false;
  }
  
  
  productPage?: Page<Product>


  /*
    Ovo je ubačeno da se ne učitavaju proizvodi dva puta za redom.
  */
  private productsLoadSubject: Subject<void> = new Subject<void>();


  productObservable$ = this.productsLoadSubject.pipe(
    takeUntil(this.destroyed),  
    debounceTime(100),
    switchMap(() => this.productService.getProducts(
      this.productFilter.query,
      this.productFilter.searchComments,
      this.productFilter.warehouseId,
      this.productFilter.tags,
      this.productFilter.categoryId
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

  }


  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  
  loadProducts()
  {
    this.productsLoadSubject.next();
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
        return "/api/images/" + preview.fileName;
      if (product.previews.length > 0)
        return "/api/images/" + product.previews[0].fileName;
    }
    return "/assets/no-image.jpg";
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


  tooltip(p: Product): string
  {
    let retVal = ""; //"Dostupno: " + p.availableQty + ". ";
    if (p.offeredQty && p.offeredQty > 0) retVal += "Na ponudama: " + p.offeredQty + ". ";
    if (p.orderedQty && p.orderedQty > 0) retVal += "Prodato: " + p.orderedQty + ". ";
    if (p.repairableQty && p.repairableQty > 0) retVal += "Za popravku: " + p.repairableQty + ". ";
    return retVal;
  }

}
