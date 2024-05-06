import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from, lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JWToken } from '../model/jwt-token';

/* https://stackoverflow.com/questions/45345354/how-use-async-service-into-angular-httpclient-interceptor */
@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  
    constructor(
        private auth: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {

        if (req.url == "/api/authenticate" || req.url == "/api/refreshtoken")
        {
            return next.handle(req);
        }

        let token = this.auth.getToken();

        if (token == null || JWToken.isTokenValid(token))
        {
            return next.handle(req);
        }

        return from(this.handle(req, next));
    
    }


    async handle(req: HttpRequest<any>, next: HttpHandler)
    {

        const authToken = await lastValueFrom(this.auth.refreshToken());

        this.auth.setToken(authToken);

        return lastValueFrom(next.handle(req));

    }

}