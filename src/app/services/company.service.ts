import { Injectable } from '@angular/core';
import { Company } from '../model/company';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getCompanies(page: number, size: number, sort: string): Observable<Page<Company>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", page)
      .set("size", size)
      .set("sort", sort);

    return this.http.get<Page<Company>>(`/api/companies`, {params: params});
    
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
