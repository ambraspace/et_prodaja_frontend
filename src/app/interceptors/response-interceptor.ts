import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  
    constructor(
        private auth: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        return next.handle(req).pipe(tap({
            error: (err: HttpErrorResponse) => {
                
                if (err.status === 401)
                {
                    this.auth.returnUrl = this.router.url;
                    this.auth.logout();
                    this.snackBar.open("Authentication failed! Please check your credentials.", undefined, {duration: 3000});
                } else {
                    let message = "Error occured:\n" + err.status + " - " + err.statusText;
                    if (err.error && err.error.message)
                        message = err.error.message;
                    this.snackBar.open(message, "OK");
                }
            }
        }));
    }


}