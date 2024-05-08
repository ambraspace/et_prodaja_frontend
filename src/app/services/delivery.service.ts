import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery } from '../model/delivery';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  getDelivery(id: number): Observable<Delivery>
  {
    return this.http.get<Delivery>(`/api/deliveries/${id}`); 
  }

  getDeliveries(page: number, size: number, sort: string, companyId?: number, status?: 'ON_THE_WAY' | 'DELIVERED'): Observable<Page<Delivery>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", page)
      .set("size", size)
      .set("sort", sort);

    if (companyId)
      params = params.set("c", companyId);

    if (status)
      params = params.set("s", status);

    return this.http.get<Page<Delivery>>(`/api/deliveries`, {params: params});
  }

  addDelivery(delivery: Delivery): Observable<Delivery>
  {
    return this.http.post<Delivery>(`/api/deliveries`, delivery);
  }

  updateDelivery(id: number, delivery: Delivery): Observable<Delivery>
  {
    return this.http.put<Delivery>(`/api/deliveries/${id}`, delivery);
  }

  deleteDelivery(id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/deliveries/${id}`);
  }

  setDelivered(id: number): Observable<Delivery>
  {
    return this.http.put<Delivery>(`/api/deliveries/${id}/delivered`, null);
  }

  deleteAllDeliveries(): Observable<void>
  {
    return this.http.delete<void>(`/api/deliveries/all`);
  }

}
