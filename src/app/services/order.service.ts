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

  getOrder(id: number): Observable<Order>
  {
    return this.http.get<Order>(`/api/orders/${id}`);
  }

  getOrders(page: number, size: number, sort: string, warehouseId?: number, status?: OrderStatus, onlyUndelivered?: boolean): Observable<Page<Order>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", page)
      .set("size", size)
      .set("sort", sort);

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
