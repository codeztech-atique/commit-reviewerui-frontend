import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
// import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { Userdetails } from '../models/user.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import  { timeDifference } from '../utils/index';

// Decode JWT Token
import { getDecodedAccessToken } from '../utils/index'
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnInit  {
    private currentUserSubject: BehaviorSubject<Userdetails>;
    public currentUser: Observable<Userdetails>;

    constructor(private http: HttpClient, private socialLoginService : SocialAuthService) {
      this.currentUserSubject = new BehaviorSubject<Userdetails>(JSON.parse(localStorage.getItem('currentUser') || '{}' ));
      this.currentUser = this.currentUserSubject.asObservable();
    }
   
    private clientId = 'af808c082fbaf60d364f';
    private clientSecret = 'f4fb1b371e305dc1608166131caf46c5365e91fd';

    private redirectUri = 'http://localhost:4200/auth/callback';
    private githubTokenUrl = 'https://github.com/login/oauth/access_token';


    initiateGitHubLogin() {
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user`;
      window.location.href = authUrl;
    }
  
    exchangeCodeForToken(code: string): Observable<any> {
      const requestBody = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri
      };
  
      return this.http.post(this.githubTokenUrl, requestBody);
    }
  
    getUserInfo(accessToken: string): Observable<any> {
      const apiUrl = 'https://api.github.com/user';
      const headers = { Authorization: `Bearer ${accessToken}` };
  
      return this.http.get(apiUrl, { headers });
    }


    // public uri = environment.productionurl;
    public uri = environment.url;

    // tslint:disable-next-line: contextual-lifecycle
    ngOnInit() {
    }

    public get currentUserValue(): Userdetails {
      return this.currentUserSubject.value;
    }

    login(user) {
      return this.http.post<any>(`${this.uri}/auth/login`, user)
      .pipe(map(auser => {
          // login successful if there's a jwt token in the response
          if (auser) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              const getUserDetails = getDecodedAccessToken(auser.idToken);
              getUserDetails['accessToken'] = auser.accessToken;
              getUserDetails['idToken'] = auser.idToken;
              // getUserDetails['refreshToken'] = auser.refreshToken;
              getUserDetails['id'] = auser.id;
              localStorage.setItem('currentUser', JSON.stringify(getUserDetails));
              this.currentUserSubject.next(getUserDetails);
              location.reload(); // Important line, Refresh page after login --- We have to refresh all the routes
          }
          return auser;
      }));
    }

    signUp(user){
      return this.http.post<any>(`${this.uri}/auth/register`, user)
        .pipe(map(auser => {
          // login successful if there's a jwt token in the response
          if (auser) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              const getUserDetails = getDecodedAccessToken(auser.idToken);
              getUserDetails['accessToken'] = auser.accessToken;
              getUserDetails['idToken'] = auser.idToken;
              // getUserDetails['refreshToken'] = auser.refreshToken;
              getUserDetails['id'] = auser.id;
              localStorage.setItem('currentUser', JSON.stringify(getUserDetails));
              this.currentUserSubject.next(getUserDetails);
              location.reload();  // Important line, Refresh page after login --- We have to refresh all the routes
          }
          return auser;
      }));
    }

    public sharedUpdatedUserDetails(data) {
      this.currentUserSubject.next(data);
    }

    verifyEmail(user) {
      return this.http.post<any>(`${this.uri}/auth/verifyemail`, user)
      .pipe(map(auser => {
          // login successful if there's a jwt token in the response
          if (auser) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log("Email verified successfully.")
            location.reload(); // Important line, Refresh page after login --- We have to refresh all the routes
            // setTimeout(() => {
            //   location.reload();
            // }, 2000)
          }
          return auser;
      }));
    }

    forgotPassword(user) {
      return this.http.post<any>(`${this.uri}/auth/forgotpassword`, user)
      .pipe(map(auser => {
          // login successful if there's a jwt token in the response
          if (auser) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log("Forgot password link has sent to your email.");
          }
          return auser;
      }));
    }

    changePassword(user) {
      return this.http.post<any>(`${this.uri}/auth/changepassword`, user)
      .pipe(map(auser => {
          // login successful if there's a jwt token in the response
          if (auser) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log("Password changed successfully !!!")
          }
          return auser;
      }));
    }

    confirmPassword(user) {
      return this.http.post<any>(`${this.uri}/auth/confirmpassword`, user)
      .pipe(map(auser => {
          // login successful if there's a jwt token in the response
          if (auser) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log("Password changed successfully !!!")
          }
          return auser;
      }));
    }

    logout() {
        // remove user from local storage to log user out
        console.log('Logout !!');
        const isLogout = { isLogout: true };
        localStorage.setItem('currentStatus', JSON.stringify(isLogout));
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.socialLoginService.signOut();
        // this.router.navigate(['/']);
        
        location.reload();
        setTimeout(() => {
          location.reload();
        }, 2000)
    }

    logoutAPICall() {
      const data = JSON.parse(localStorage.getItem('currentUser'));
      if(data) {
        const sendData = {
          id: data.id,
          userId: data["cognito:username"],
          email: data.email,
          logoutTime: new Date().getTime(),
          totalLoginHrs: timeDifference(parseInt(data.auth_time+"000"),  new Date().getTime())
        }
        return this.http.post(`${this.uri}/auth/logout`, sendData);
      }
    }


    
}
