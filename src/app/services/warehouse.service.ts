import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Warehouse } from '../model/warehouse';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }

  getWarehouses(companyId: number): Observable<Warehouse[]>
  {
    return this.http.get<Warehouse[]>(`/api/companies/${companyId}/warehouses`);
  }

  getWarehouse(companyId: number, id: number): Observable<Warehouse>
  {
    return this.http.get<Warehouse>(`/api/companies/${companyId}/warehouses/${id}`);
  }

  getWarehouseById(id: number): Observable<Warehouse>
  {
    return this.http.get<Warehouse>(`/api/warehouses/${id}`);
  }

  addWarehouse(companyId: number, warehouse: Warehouse): Observable<Warehouse>
  {
    return this.http.post<Warehouse>(`/api/companies/${companyId}/warehouses`, warehouse);
  }

  updateWarehouse(companyId: number, id: number, warehouse: Warehouse): Observable<Warehouse>
  {
    return this.http.put<Warehouse>(`/api/companies/${companyId}/warehouses/${id}`, warehouse);
  }

  deleteWarehouse(companyId: number, id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/companies/${companyId}/warehouses/${id}`);
  }

  searchWarehouse(query: string, size: number): Observable<Warehouse[]>
  {

    let param: HttpParams = new HttpParams();
    param = param.set("q", query);
    param = param.set("size", "" + size);

    return this.http.get<Warehouse[]>(`/api/warehouses/search`, {params: param});

  }

}
