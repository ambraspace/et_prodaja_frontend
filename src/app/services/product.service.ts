import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  page: number = 0;
  size: number = 10;
  sort: string = "name,ASC";

  rowCount: number = 2;

  getProducts(query?: string, includeComments?: boolean, warehouseId?: number, tagIds?: string[], categoryId?: number): Observable<Page<Product>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", this.page)
      .set("size", this.size)
      .set("sort", this.sort);

    if (query) params = params.set("q", query);

    if (includeComments) params = params.set("cm", includeComments);

    if (warehouseId) params = params.set("w", warehouseId);

    if (tagIds && tagIds.length > 0)
    {
      tagIds.forEach(t => params = params.append("t", t));
    }

    if (categoryId) params = params.set("ct", categoryId);

    return this.http.get<Page<Product>>(`/api/products`, {params: params});

  }

  getProduct(id: number): Observable<Product>
  {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  addProduct(product: Product): Observable<Product>
  {
    return this.http.post<Product>(`/api/products`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product>
  {
    return this.http.put<Product>(`/api/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/products/${id}`);
  }

}
