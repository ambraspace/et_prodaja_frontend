import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  page: number = 0;
  size: number = 10;
  sort: string = "username,ASC";

  getUsers(): Observable<Page<User>>
  {

    let params: HttpParams = new HttpParams()
      .set("page", this.page)
      .set("size", this.size)
      .set("sort", this.sort);

    return this.http.get<Page<User>>(`/api/users`, {params: params});
    
  }

  getUser(username?: string): Observable<User>
  {
    if (username)
      return this.http.get<User>("/api/users/" + username);
    else
      return this.http.get<User>("/api/user");
  }

  addUser(user: User): Observable<User>
  {
    return this.http.post<User>("/api/users", user);
  }

  updateUser(username: string, user: User): Observable<User>
  {
    return this.http.put<User>("/api/users/" + username, user);
  }

  deleteUser(username: string): Observable<void>
  {
    return this.http.delete<void>("/api/users/" + username);
  }
  
}
