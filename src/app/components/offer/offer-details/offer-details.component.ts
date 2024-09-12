import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../model/item';
import { Offer } from '../../../model/offer';
import { OfferService } from '../../../services/offer.service';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe, DecimalPipe, NgIf, PercentPipe } from '@angular/common';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { Router, RouterLink } from '@angular/router';
import { OfferFormComponent } from "../offer-form/offer-form.component";
import { MatButtonModule } from '@angular/material/button';
import { OfferStatusLocalizePipe } from '../../../pipes/offer-status-localize.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AddOrEditOfferComponent } from '../add-or-edit-offer/add-or-edit-offer.component';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';
import { TextInputDialog } from '../../dialogs/text-input-dialog/text-input-dialog.component';
import { ProductFilter } from '../../../model/product-filter';
import { Product } from '../../../model/product';
import { ProductListComponent } from "../../product/product-list/product-list.component";
import { ProductService } from '../../../services/product.service';
import { ProductFormComponent } from "../../product/product-form/product-form.component";
import { ProductFilterComponent } from "../../product/product-filter/product-filter.component";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ItemEditorComponent } from '../../item/item-editor/item-editor.component';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [
    NgIf,
    MatTableModule,
    DecimalPipe,
    PercentPipe,
    CurrencyPipe,
    ToEuroPipe,
    DatePipe,
    OfferStatusLocalizePipe,
    RouterLink,
    OfferFormComponent,
    MatButtonModule,
    ProductListComponent,
    ProductFormComponent,
    ProductFilterComponent
],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OfferDetailsComponent implements OnInit {

  constructor(
    private offerService: OfferService,
    private itemService: ItemService,
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router,
    private fileSaverService: FileSaverService
  ) {}


  @Input()
  set id(id: string)
  {
    this.offerId = id;
  }


  offerId!: string;

  offer?: Offer;

  items: Item[] = [];

  displayedColumns = ['no', 'productName', 'unit', 'quantity', 'cost', 'margin', 'price', 'discount', 'netPrice', 'value'];
  footerColumns = ['no', 'productName', 'cost', 'margin', 'value', 'expand'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];


  expandedElement?: Item


  @ViewChild('offerForm') offerFormComponent: OfferFormComponent | undefined;


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
      this._productFilter = pf;
    } else {
      this._productFilter = {
        query: undefined,
        searchComments: false,
        warehouseId: undefined,
        tags: [],
        categoryId: undefined
      }
    }
  }

  private _productFilter?: ProductFilter;


  ngOnInit(): void {
    this.loadOffer();
    this.loadItems();
  }


  loadOffer(): void
  {
    this.offerService.getOffer(this.offerId).subscribe(o => {
      this.offer = o;
    });
  }


  loadItems(): void
  {
    this.itemService.getOfferItems(this.offerId).subscribe((p) => {
      this.items = p;
    })
  }


  addItems(): void
  {
    this.router.navigateByUrl(`/offers/${this.offerId}/productSelector`);
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


  onProductClick = (p: Product) => {
    console.log(p);
    
  }


  editOffer(): void
  {

    let dialogRef = this.dialog.open<AddOrEditOfferComponent, any, Offer>(
      AddOrEditOfferComponent,
      {data: {offerId: this.offer?.id, offer: this.offer}, width: "500px"}
    );

    dialogRef.afterClosed().subscribe(o => {
      if (o)
      {
        this.offer = o;
      }
    })

  }


  deleteOffer(): void
  {

    let dialogRef = this.dialog.open<YesNoDialogComponent, any, string>(
      YesNoDialogComponent,
      {data: "Želite li obrisati ovu ponudu?"});

    dialogRef.afterClosed().subscribe(r => {
      if (r === "YES")
      {
        this.offerService.deleteOffer(this.offerId).subscribe(() => {
          this.router.navigateByUrl("/offers")
        })
      }
    })
  }


  duplicateOffer(): void
  {

    let dialogRef = this.dialog.open<YesNoDialogComponent, any, string>(
      YesNoDialogComponent,
      {data: "Želite li od ove ponude napraviti novu?"});

    dialogRef.afterClosed().subscribe(r => {
      if (r === "YES")
      {
        this.offerService.duplicateOffer(this.offerId).subscribe((o) => {
          this.router.navigateByUrl("/offers"); 
        })
      }
    })
  }


  acceptOffer(): void
  {

    let dialogRef = this.dialog.open<YesNoDialogComponent, any, string>(
      YesNoDialogComponent,
      {data: "Želite li označiti ovu ponudu kao prihvaćenu?"});

    dialogRef.afterClosed().subscribe(r => {
      if (r === "YES")
      {
        this.offerService.acceptOffer(this.offerId).subscribe(() => {
          this.loadOffer();
        })
      }
    })
  }


  cancelOffer(): void
  {

    let dialogRef = this.dialog.open<YesNoDialogComponent, any, string>(
      YesNoDialogComponent,
      {data: "Želite li označiti ovu ponudu kao odbijenu?"});

    dialogRef.afterClosed().subscribe(r => {
      if (r === "YES")
      {
        let dialogRef2 = this.dialog.open<TextInputDialog, {placeholder: string, defaultValue: string, allowEmpty: boolean, multiline: boolean}, string>   (
          TextInputDialog, {data: {placeholder: "Razlog odustajanja", defaultValue: "", allowEmpty: true, multiline: true}, width: "400px"});
        dialogRef2.afterClosed().subscribe(r2 => {
          if (r2 != undefined)
          {
            this.offerService.cancelOffer(this.offerId, r2).subscribe(() => {
              this.loadOffer();
            })
          }
        })
      }
    })
  }


  downloadOffer(): void
  {
    if (this.offer)
    {
      {
        this.offerService.downloadOffer(this.offer.id).subscribe((res) => {
          this.fileSaverService.save(res.body, "Ponuda br. " + this.offer!.id + ".pdf");
        });
      }
    }
  }


  editItem(item: Item): void
  {
    let dialogRef = this.dialog.open<ItemEditorComponent, any, {item: Item, applyDiscountToAll: boolean}>(
      ItemEditorComponent, {data: {item: item}, width: "500px"}
    );

    dialogRef.afterClosed().subscribe(res => {
      if (res)
      {
        if (res.applyDiscountToAll)
        {
          this.items.forEach(i => {
            i.discountPercent = res.item.discountPercent
          })
          let itemIndex = this.items.findIndex(i => i.id == res.item.id);
          this.items.splice(itemIndex,1, res.item);
          this.itemService.updateItems(this.offerId, this.items).subscribe(is => {
            this.items = is;
            this.loadOffer();
          })
        } else {
          let itemIndex = this.items.findIndex(i => i.id == res.item.id);
          this.itemService.updateItems(this.offerId, Array.of(res.item)).subscribe(is => {
            this.items.splice(itemIndex, 1, is[0]);
            this.items = this.items.slice(0, this.items.length);
            this.loadOffer();
          })
        }
      }
    })
  }


  deleteItem(itemId: number)
  {

    let dialogRef = this.dialog.open<YesNoDialogComponent, any, string>(
      YesNoDialogComponent,
      {data: "Želite li obrisati ovu stavku?"}
    )

    dialogRef.afterClosed().subscribe(res => {
      if (res === 'YES')
      {
        let itemIndex = this.items.findIndex(i => i.id == itemId);
        if (itemIndex >= 0)
        {
          this.itemService.deleteItem(this.offerId, itemId).subscribe(() => {
            this.items.splice(itemIndex, 1);
            this.items = this.items.slice(0, this.items.length);
            this.loadOffer();
          })
        }
      }
    })

  }


  getOfferValue(type: number): number
  {
    if (this.offer)
    {
      switch(type)
      {
        case 0:
          return this.offer.value;
        case 1:
          return this.offer.value * this.offer.vat / 100;
        case 2:
          return this.offer.value * (1+this.offer.vat / 100);
        default:
          return 0;
      }
    }
    return 0;
  }


  getMargin(item: Item): number
  {
    if (item && item.netPrice)
      return item.netPrice / item.stockInfo.unitPrice - 1;
    return 0;
  }


  isOfferInvalid(o: Offer): boolean
  {
    let endDate = new Date()  
    endDate.setHours(0,0,0,0);
    
    if (o.status == 'ACTIVE' && (new Date(o.validUntil).valueOf() <= endDate.valueOf()))
      return true;

    return false;
  }

  
}
