import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../../../services/order.service';
import { Page } from '../../../model/page';
import { Order } from '../../../model/order';
import { MatPaginator } from '@angular/material/paginator';
import { OrderStatusLocalizePipe } from '../../../pipes/order-status-localize.pipe';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../dialogs/yes-no-dialog/yes-no-dialog.component';
import { RouterLink } from '@angular/router';
import { FileSaverModule, FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [
    NgIf,
    MatPaginator, MatTableModule,
    MatButtonModule,
    CurrencyPipe, DatePipe, OrderStatusLocalizePipe, ToEuroPipe,
    RouterLink
  ],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.css'
})
export class OrderViewComponent implements OnInit {

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private fileSaverService: FileSaverService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  orders: Page<Order> | null = null;

  displayedColumns: string[] = [
    'id', 'warehouse', 'status', 'creation', 'closure', 'value', 'actions'
  ]

  get orderList(): Order[]
  {
    if (this.orders)
      return this.orders.content;
    else
      return [];
  }

  loadOrders(): void
  {
    this.orderService.getOrders().subscribe(o => this.orders = o);
  }


  editOrder(id: number): void
  {

  }


  deleteOrder(id: number): void
  {

  }


  closeOrder(id: number): void
  {
    let dialogRef = this.dialog.open<YesNoDialogComponent, any, string>(
      YesNoDialogComponent,
      {data: "Želite li zatvoriti ovu narudžbu?"}
    )

    dialogRef.afterClosed().subscribe(res => {
      if (res == 'YES')
      {
        this.orderService.closeOrder(id).subscribe(o => {
          this.loadOrders()
        })
      }
    })
  }


  downloadOrder(id: number): void
  {
    this.orderService.downloadOrder(id).subscribe((res) => {
      this.fileSaverService.save(res.body, "narudžba br. " + id + ".xlsx");
    });
  }


  updateTable(event: any): void
  {
    this.orderService.page = event.pageIndex;
    this.orderService.size = event.pageSize;
    this.loadOrders();
  }



}
