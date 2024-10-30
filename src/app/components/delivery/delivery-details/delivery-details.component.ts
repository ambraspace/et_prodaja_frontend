import { Component, Input, OnInit } from '@angular/core';
import { Delivery } from '../../../model/delivery';
import { Item } from '../../../model/item';
import { CurrencyPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { DeliveryStatusLocalizePipe } from '../../../pipes/delivery-status-localize.pipe';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { MatButtonModule } from '@angular/material/button';
import { DeliveryItem } from '../../../model/delivery-item';
import { DeliveryService } from '../../../services/delivery.service';
import { DeliveryItemService } from '../../../services/delivery-item.service';
import { ItemSelectorComponent } from '../item-selector/item-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [
    NgIf,
    DeliveryStatusLocalizePipe, DatePipe, DecimalPipe, ToEuroPipe, CurrencyPipe,
    MatTableModule, MatButtonModule,
    RouterLink
  ],
  templateUrl: './delivery-details.component.html',
  styleUrl: './delivery-details.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class DeliveryDetailsComponent implements OnInit {


  constructor(
    private deliveryService: DeliveryService,
    private deliveryItemService: DeliveryItemService,
    private dialog: MatDialog,
    private router: Router
  ) {}


  @Input()
  set id(id: string)
  {
    this.deliveryId = id;
  }


  deliveryId!: string;


  delivery?: Delivery;


  items: DeliveryItem[] = [];


  displayedColumns = ['no', 'productName', 'unit', 'quantity', 'cost', 'note'];
  footerColumns = ['no', 'productName', 'cost', 'note'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];


  expandedElement?: Item


  ngOnInit(): void {
    this.loadDelivery();
    this.loadItems();
  }


  loadDelivery(): void
  {
    this.deliveryService.getDelivery(this.deliveryId).subscribe(d => {
      this.delivery = d;
    });
  }


  deleteDelivery(): void
  {
    let dialogRef = this.dialog.open(YesNoDialogComponent, {data: "Želite li obrisati isporuku?"});
    dialogRef.afterClosed().subscribe(res => {
      if (res === "YES")
      {
        this.deliveryService.deleteDelivery(this.deliveryId).subscribe(() => {
          this.router.navigateByUrl("/deliveries");
        });
      }
    })
  }


  markDelivered(): void
  {
    let dialogRef = this.dialog.open(YesNoDialogComponent, {data: "Želite li označiti isporuku isporučenom?"});
    dialogRef.afterClosed().subscribe(res => {
      if (res === "YES")
      {
        this.deliveryService.setDelivered(this.deliveryId).subscribe(() => {
          this.loadDelivery();
        });
      }
    })
  }


  loadItems(): void
  {
    this.deliveryItemService.getDeliveryItems(this.deliveryId).subscribe((di) => {
      this.items = di;
    })
  }


  addItems(): void
  {

    let dialogRef = this.dialog.open<ItemSelectorComponent, {delivery: Delivery}, DeliveryItem[]>(
      ItemSelectorComponent, {data: {delivery: this.delivery!}, width: "1000px"});

    dialogRef.afterClosed().subscribe(res => {
      if (res)
      {
        this.loadDelivery();
        this.loadItems();
      }
    });

  }


  editItem(item: DeliveryItem): void
  {

  }


  deleteItem(id: number): void
  {

  }


  downloadDelivery(): void
  {

  }




}
