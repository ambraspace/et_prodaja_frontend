import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
    constructor(
        private auth: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {

        let token = this.auth.getToken();

        if (token != null)
        {
            const reqClone = req.clone({headers: req.headers.append("Authorization", "Bearer " + token.jwttoken)});
            return next.handle(reqClone);
        } else {
            return next.handle(req);
        }

    }

}