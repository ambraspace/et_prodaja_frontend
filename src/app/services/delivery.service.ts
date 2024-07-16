import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Delivery } from '../model/delivery';
import { Page } from '../model/page';
import { DeliveryStatus } from '../model/delivery-status';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  page: number = 0;
  size: number = 10;
  sort: string = "id,DESC";

  getDelivery(id: number): Observable<Delivery>
  {
    return this.http.get<Delivery>(`/api/deliveries/${id}`); 
  }

  getDeliveries(companyId?: number, status?: DeliveryStatus): Observable<Page<Delivery>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", this.page)
      .set("size", this.size)
      .set("sort", this.sort);

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
