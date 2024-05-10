import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../model/stock-info';
import { OrderStatus } from '../model/order-status';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  page: number = 0;
  size: number = 10;
  sort: string = "id,DESC";

  getOrder(id: number): Observable<Order>
  {
    return this.http.get<Order>(`/api/orders/${id}`);
  }

  getOrders(warehouseId?: number, status?: OrderStatus, onlyUndelivered?: boolean): Observable<Page<Order>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", this.page)
      .set("size", this.size)
      .set("sort", this.sort);

    if (warehouseId) params = params.set("w", warehouseId);
    if (status) params = params.set("s", status);
    if (onlyUndelivered) params = params.set("u", onlyUndelivered);

    return this.http.get<Page<Order>>(`/api/orders`, {params: params});

  }

  closeOrder(id: number): Observable<Order>
  {
    return this.http.put<Order>(`/api/orders/${id}/close`, null);
  }

  deleteAllOrders(): Observable<void>
  {
    return this.http.delete<void>(`/api/orders/all`);
  }

}
