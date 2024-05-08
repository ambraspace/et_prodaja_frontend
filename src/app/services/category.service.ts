import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]>
  {
    return this.http.get<Category[]>("/api/categories");
  }

  saveCategories(categories: Category[]): Observable<Category[]>
  {
    return this.http.post<Category[]>("/api/categories", categories);
  }
  
}
