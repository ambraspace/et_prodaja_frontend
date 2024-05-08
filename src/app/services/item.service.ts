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

  getOfferItems(offerId: string): Observable<Item[]>
  {
    return this.http.get<Item[]>(`/api/offers/${offerId}/items`);
  }

  getOrderItems(orderId: number): Observable<Item[]>
  {
    return this.http.get<Item[]>(`/api/orders/${orderId}/items`);
  }

  getDeliveryItems(deliveryId: number): Observable<Item[]>
  {
    return this.http.get<Item[]>(`/api/deliveries/${deliveryId}/items`);
  }

  addItem(offerId: string, item: Item): Observable<Item>
  {
    return this.http.post<Item>(`/api/offers/${offerId}/items`, item);
  }

  updateItem(offerId: string, id: number, item: Item): Observable<Item>
  {
    return this.http.put<Item>(`/api/offers/${offerId}/items/${id}`, item);
  }

  deleteItem(offerId: string, id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/offers/${offerId}/items/${id}`);
  }

}
