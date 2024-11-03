import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
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

  getOffers(username?: string, companyId?: number, statuses?: string[], productId?: number)
  {

    let params: HttpParams = new HttpParams()
      .set("page", this.page)
      .set("size", this.size)
      .set("sort", this.sort);

    if (username) params = params.set("u", username);
    if (companyId) params = params.set("c", companyId);
    if (statuses && statuses.length > 0)
    {
      statuses.forEach(s => params = params.append('s', s))
    }
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

  downloadOffer(fileName: string): Observable<HttpResponse<Blob>>
  {

    return this.http.get(`/api/files/offers/${fileName}`, {
      observe: 'response',
      responseType: 'blob'
    })

  }

  deleteAllOffers(): Observable<void>
  {
    return this.http.delete<void>(`/api/offers/all`);
  }

}
