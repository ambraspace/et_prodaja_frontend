import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockInfo } from '../model/stock-info';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class StockInfoService {

  constructor(private http: HttpClient) { }

  page: number = 0;
  size: number = 10;
  sort: string = "id,DESC";

  getStockInfo(productId: number, id: number): Observable<StockInfo>
  {
    return this.http.get<StockInfo>(`/api/products/${productId}/stockInfos/${id}`);
  }

  getStockInfosByProduct(productId: number): Observable<Page<StockInfo>>
  {

     let params: HttpParams = new HttpParams()
      .set("page", this.page)
      .set("size", this.size)
      .set("sort", this.sort);

    return this.http.get<Page<StockInfo>>(`/api/products/${productId}/stockInfos`, {params: params});

  }

  addStockInfo(productId: number, stockInfo: StockInfo): Observable<StockInfo>
  {
    return this.http.post<StockInfo>(`/api/products/${productId}/stockInfos`, stockInfo);
  }

  updateStockInfo(productId: number, id: number, stockInfo: StockInfo): Observable<StockInfo>
  {
    return this.http.put<StockInfo>(`/api/products/${productId}/stockInfos/${id}`, stockInfo);
  }

  deleteStockInfo(productId: number, id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/products/${productId}/stockInfos/${id}`);
  }

}
