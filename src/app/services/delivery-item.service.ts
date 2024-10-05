import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeliveryItem } from '../model/delivery-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryItemService {

  constructor(
    private http: HttpClient
  ) { }


  getDeliveryItem(deliveryId: number, id: number): Observable<DeliveryItem>
  {
    return this.http.get<DeliveryItem>(`/api/deliveries/${deliveryId}/deliveryItems/${id}`);
  }


  getDeliveryItems(deliveryId: number): Observable<DeliveryItem[]>
  {
    return this.http.get<DeliveryItem[]>(`/api/deliveries/${deliveryId}/deliveryItems`);
  }


  addDeliveryItems(deliveryId: number, dis: DeliveryItem[]): Observable<DeliveryItem[]>
  {
    return this.http.post<DeliveryItem[]>(`/api/deliveries/${deliveryId}/deliveryItems`, dis);
  }


  updateDeliveryItem(deliveryId: number, id: number, di: DeliveryItem): Observable<DeliveryItem>
  {
    return this.http.put<DeliveryItem>(`/api/deliveries/${deliveryId}/deliveryItems/${id}`, di);
  }


  deleteDeliveryItem(deliveryId: number, id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/deliveries/${deliveryId}/deliveryItems/${id}`);
  }
  

}
