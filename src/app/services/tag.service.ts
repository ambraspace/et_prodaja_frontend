import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { Tag } from '../model/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  getTags(page: number, size: number, sort: string): Observable<Page<Tag>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", page)
      .set("size", size)
      .set("sort", sort);

    return this.http.get<Page<Tag>>(`/api/tags`, {params: params});

  }

  getTag(id: number): Observable<Tag>
  {
    return this.http.get<Tag>(`/api/tags/${id}`);
  }

  addTag(tag: Tag): Observable<Tag>
  {
    return this.http.post<Tag>(`/api/tags`, tag);
  }

  deleteTag(id: number): Observable<void>
  {
    return this.http.delete<void>(`/api/tags/${id}`);
  }

  searchTags(query: string): Observable<Tag[]>
  {
    //TODO: add bounce
    
    let params: HttpParams = new HttpParams().set("q", query);

    return this.http.get<Tag[]>(`/api/tags/search`, {params: params});
    
  }

}
