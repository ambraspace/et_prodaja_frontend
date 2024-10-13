import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../model/order';
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

  getOrder(id: string): Observable<Order>
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

  closeOrder(id: string): Observable<Order>
  {
    return this.http.put<Order>(`/api/orders/${id}/close`, null);
  }

  downloadOrder(id: string): Observable<HttpResponse<Blob>>
  {
    return this.http.get(`/api/orders/${id}/dl`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  deleteAllOrders(): Observable<void>
  {
    return this.http.delete<void>(`/api/orders/all`);
  }

}
