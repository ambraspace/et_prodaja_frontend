import { Injectable } from '@angular/core';
import { Company } from '../model/company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  page: number = 0;
  size: number = 10;
  sort: string = "name,ASC";

  getCompanies(): Observable<Page<Company>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", this.page)
      .set("size", this.size)
      .set("sort", this.sort);

    return this.http.get<Page<Company>>(`/api/companies`, {params: params});
    
  }


  searchCompanies(query: string, querySize?: number): Observable<Company[]>
  {

    if (!querySize) querySize = 5;

    let params: HttpParams = new HttpParams()
      .set("q", query);

    params = params.set("size", querySize);

    return this.http.get<Page<Company>>(`/api/companies`, {params: params})
      .pipe(map(page => page.content));

  }

  getCompany(id: number): Observable<Company>
  {
    return this.http.get<Company>("/api/companies/" + id);
  }

  addCompany(company: Company): Observable<Company>
  {
    return this.http.post<Company>("/api/companies", company);
  }

  updateCompany(id: number, company: Company): Observable<Company>
  {
    return this.http.put<Company>("/api/companies/" + id, company);
  }

  deleteCompany(id: number): Observable<void>
  {
    return this.http.delete<void>("/api/companies/" + id);
  }

}
