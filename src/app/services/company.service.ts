import { Injectable } from '@angular/core';
import { Company } from '../model/company';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }


  getCompanies(): Observable<Page<Company>>
  {
    return this.http.get<Page<Company>>("/api/companies?page=0&size=10&sort=name%2CASC");
  }

}
