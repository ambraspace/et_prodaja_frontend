import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OfferStatus } from '../model/offer-status';
import { Page } from '../model/page';
import { Offer } from '../model/offer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private http: HttpClient) { }

  page: number = 0;
  size: number = 10;
  sort: string = "id,DESC";

  getOffer(id: string): Observable<Offer>
  {
    return this.http.get<Offer>(`/api/offers/${id}`);
  }

  getOffers(username?: string, companyId?: number, status?: OfferStatus, productId?: number)
  {

    let params: HttpParams = new HttpParams()
      .set("page", this.page)
      .set("size", this.size)
      .set("sort", this.sort);

    if (username) params = params.set("u", username);
    if (companyId) params = params.set("c", companyId);
    if (status) params = params.set("s", status);
    if (productId) params = params.set("p", productId);

    return this.http.get<Page<Offer>>(`/api/offers`, {params: params});

  }

  addOffer(offer: Offer): Observable<Offer>
  {
    return this.http.post<Offer>(`/api/offers`, offer);
  }

  updateOffer(id: string, offer: Offer): Observable<Offer>
  {
    return this.http.put<Offer>(`/api/offers/${id}`, offer);
  }

  deleteOffer(id: string): Observable<void>
  {
    return this.http.delete<void>(`/api/offers/${id}`);
  }

  cancelOffer(id: string, reason: string): Observable<Offer>
  {

    let params: HttpParams = new HttpParams();
    
    if (reason) params = params.set("r", reason);

    return this.http.patch<Offer>(`/api/offers/${id}/cancel`, null, {params: params});

  }

  acceptOffer(id: string): Observable<Offer>
  {
    return this.http.patch<Offer>(`/api/offers/${id}/accept`, null);
  }

  duplicateOffer(id: string): Observable<Offer>
  {
    return this.http.post<Offer>(`/api/offers/${id}/duplicate`, null);
  }

  deleteAllOffers(): Observable<void>
  {
    return this.http.delete<void>(`/api/offers/all`);
  }

}
