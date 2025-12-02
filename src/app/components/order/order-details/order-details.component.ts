import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../../model/order';
import { OrderService } from '../../../services/order.service';
import { CurrencyPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { OrderStatusLocalizePipe } from '../../../pipes/order-status-localize.pipe';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../model/item';
import { MatTableModule } from '@angular/material/table';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { RouterLink } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';

@Component({
    selector: 'app-order-details',
    imports: [
        NgIf,
        OrderStatusLocalizePipe, DatePipe, DecimalPipe, CurrencyPipe, ToEuroPipe,
        MatTableModule,
        RouterLink,
        MatButtonModule
    ],
    templateUrl: './order-details.component.html',
    styleUrl: './order-details.component.css',
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class OrderDetailsComponent implements OnInit {


  constructor(
    private orderService: OrderService,
    private itemService: ItemService,
    private dialog: MatDialog
  ) {}



  @Input("id")
  orderId: string = '';


  order?: Order;


  items?: Item[];


  expandedElement?: Item


  displayedColumns = ['no', 'productName', 'reference', 'unit', 'quantity', 'unitPrice', 'value'];
  footerColumns = ['no', 'productName', 'value', 'expand'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];


  ngOnInit(): void {
    this.loadOrder();
  }


  loadOrder(): void
  {
    this.orderService.getOrder(this.orderId).subscribe(o => {
      this.order = o;
      this.loadItems();
    })
  }


  loadItems(): void
  {
    this.itemService.getOrderItems(this.orderId, false).subscribe(is => {
      this.items = is;
    })
  }


  closeOrder(): void
  {
    let dialogRef = this.dialog.open<YesNoDialogComponent, any, string>(
      YesNoDialogComponent,
      {data: "Želite li zatvoriti ovu narudžbu?"}
    )

    dialogRef.afterClosed().subscribe(res => {
      if (res == 'YES')
      {
        this.orderService.closeOrder(this.orderId).subscribe(o => {
          this.loadOrder()
        })
      }
    })
  }


  downloadOrder(): void
  {
    if (this.order)
    {
      {
        this.orderService.downloadOrder(this.orderId).subscribe((res) => {
          let file: File = new File([res.body!], "Narudžba br. " + this.orderId + ".xlsx", {type: res.body?.type});
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank', );
        });
      }
    }
  }

}
