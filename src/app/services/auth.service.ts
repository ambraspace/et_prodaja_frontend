import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JWToken } from '../model/jwt-token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.token = null;

    let savedToken = localStorage.getItem("JWT");

    if (savedToken)
    {
      this.token = JSON.parse(savedToken);
    }

  }


  returnUrl: string | null = null;

  private token: JWToken | null;


  getToken(): JWToken | null
  {
    return this.token;
  }


  setToken(token: JWToken): void
  {
    this.token = token;
    localStorage.setItem("JWT", JSON.stringify(this.token))
  }



  authenticate(username: string, password: string): Observable<JWToken>
  {
    return this.http.post<JWToken>("/api/authenticate", {username: username, password: password});
  }


  refreshToken(): Observable<JWToken>
  {
    return this.http.get<JWToken>("/api/refreshtoken")
  }


  logout()
  {
    localStorage.removeItem("JWT");
    this.token = null;
    this.router.navigateByUrl("/login")
  }



}
