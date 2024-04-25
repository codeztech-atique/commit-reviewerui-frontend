import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { AuthenticationService } from '../auth/authentication.service';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.authenticationService.logout();
                
                // auto logout if 401 response returned from api
                // this.authenticationService.logoutAPICall().subscribe({
                //     next: (response) => {
                //        this.authenticationService.logout();
                //     },
                //     error: (error) => {
                //        console.log("Logout error:", error);
                //        localStorage.removeItem('currentUser');
                //        location.reload(); // atique
                //     }
                // })
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
