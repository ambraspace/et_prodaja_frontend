import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../model/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getOfferItem(offerId: string, id: number): Observable<Item>
  {
    return this.http.get<Item>(`/api/offers/${offerId}/items/${id}`);
  }

  getOrderItem(orderId: string, id: number): Observable<Item>
  {
    return this.http.get<Item>(`/api/orders/${orderId}/items/${id}`);
  }

  getOfferItems(offerId: string): Observable<Item[]>
  {
    return this.http.get<Item[]>(`/api/offers/${offerId}/items`);
  }

  getOrderItems(orderId: number, onlyUndelivered?: boolean): Observable<Item[]>
  {
    if (onlyUndelivered)
    {
      return this.http.get<Item[]>(`/api/orders/${orderId}/items?ou=true`);
    } else {
      return this.http.get<Item[]>(`/api/orders/${orderId}/items`);
    }
  }

  addItems(offerId: string, items: Item[]): Observable<Item[]>
  {
    return this.http.post<Item[]>(`/api/offers/${offerId}/items`, items);
  }

  updateItems(offerId: string, items: Item[]): Observable<Item[]>
  {
    return this.http.put<Item[]>(`/api/offers/${offerId}/items`, items);
  }

  deleteItem(offerId: string, id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/offers/${offerId}/items/${id}`);
  }

}
