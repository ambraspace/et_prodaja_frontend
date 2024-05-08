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

  getProducts(page: number, size: number, sort: string,
    query?: string, includeComments?: boolean, warehouseId?: number, tagIds?: number[], categoryId?: number): Observable<Page<Product>>
  {

    let tagString = null;

    if (tagIds && tagIds.length > 0)
    {
      tagString = JSON.stringify(tagIds);
      tagString = tagString.slice(1, tagString.length - 1);
    }

    let params: HttpParams = new HttpParams()
      .set("page", page)
      .set("size", size)
      .set("sort", sort);

    if (query) params = params.set("q", query);
    if (includeComments) params = params.set("cm", includeComments);
    if (warehouseId) params = params.set("w", warehouseId);
    if (tagString) params = params.set("t", tagString);
    if (categoryId) params = params.set("ct", categoryId);

    return this.http.get<Page<Product>>(`/api/products`, {params: params});

  }

  getProduct(id: number): Observable<Product>
  {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  // TODO: Properly implement file upload and download
  downloadProductPreview(productId: number, previewId: number): Observable<Blob>
  {
    return this.http.get<Blob>(`/api/products/${productId}/previews/${previewId}/download`);
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
