import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { AuthenticationService } from '../auth/authentication.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = this.authenticationService.currentUserValue;
        const res = JSON.parse(JSON.stringify(currentUser));
        if (currentUser && res.idToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${res.idToken}`,
                    // refresh_token: `${res.refreshToken}`,
                    // access_token: `${res.accessToken}`,
                    userid: `${res['cognito:username']}`,
                    useremail: `${res.email}`,
                }
            });
        }
        return next.handle(request);
    }
}
