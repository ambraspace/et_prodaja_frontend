import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../../../services/order.service';
import { Page } from '../../../model/page';
import { Order } from '../../../model/stock-info';
import { MatPaginator } from '@angular/material/paginator';
import { OrderStatusLocalizePipe } from '../../../pipes/order-status-localize.pipe';
import { ToEuroPipe } from '../../../pipes/to-euro.pipe';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [NgIf, MatPaginator, MatTableModule, MatButtonModule, CurrencyPipe, DatePipe, OrderStatusLocalizePipe, ToEuroPipe],
  templateUrl: './order-view.component.html',
  styleUrl: './order-view.component.css'
})
export class OrderViewComponent implements OnInit {

  constructor(
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  orders: Page<Order> | null = null;

  displayedColumns: string[] = [
    'id', 'warehouse', 'status', 'closure', 'value', 'actions'
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



  updateTable(event: any): void
  {
    this.orderService.page = event.pageIndex;
    this.orderService.size = event.pageSize;
    this.loadOrders();
  }

}
