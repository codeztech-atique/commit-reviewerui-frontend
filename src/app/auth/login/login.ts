import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Userdetails } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import appSettings from '../../config/app-settings';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "@abacritt/angularx-social-login";

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})

export class LoginPage implements OnInit, OnDestroy {
  bg = '/assets/img/login-bg/login-bg-17.jpg';
  bgList;
  app;
  appSettings = appSettings;
  email: any;
  password: any;
  currentUser: Userdetails;
  currentUserSubscription: Subscription;
  showLoader: boolean;
  isEnabledSubmit: boolean;
  confirmButtonText: any;
  tooltipText: string = 'Password should have minimum 6 characters !!'; // Set the default tooltip text
  showPassword = false;
  isInvalidEmail = false;
  isInvalidPassword = false;
  rememberMe: boolean = false;
  socialUserLogin: SocialUser;

  constructor(private router: Router, private auth: AuthenticationService, private cookieService: CookieService, private http: HttpClient, private titleService: Title, private socialLoginService : SocialAuthService, private route: ActivatedRoute) {
    this.showLoader = false;
    this.isEnabledSubmit = false;
    this.confirmButtonText = "Sign me in";
    this.appSettings.appEmpty = true;
  }


  ngOnInit() { 
    this.titleService.setTitle('Zoom codeguard | Login Page');
    // for login with linkedin
    this.route.queryParams.subscribe(params => {
      const logInErr = <HTMLElement>document.getElementById('login-error');
      const code = params['code'];
      
      if (code) {
        // Do something with the 'code' parameter
        this.confirmButtonText = "Please wait";
        this.showLoader = true;
        this.isEnabledSubmit = true;
        logInErr.style.display = 'none';


      }
    });
  }
  

  ngOnDestroy() {
    this.appSettings.appEmpty = false;
  }

  signIn() {
    const loginErr = <HTMLElement>document.getElementById('login-error');
    const mpattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const ppattern = /^.{6,}$/;
    
    // remember me logic
    if (this.rememberMe) {
      // If "Remember Me" is checked, set a cookie to remember the user's login state
      this.cookieService.set('userLoggedIn', 'true', 365); // 365 days
    } else {
      // If "Remember Me" is not checked, remove the cookie if it exists
      this.cookieService.delete('userLoggedIn');
    }

    if (this.email && this.password && this.email.match(mpattern) && (this.password.match(ppattern))) {
      this.confirmButtonText = "Please wait";
      this.showLoader = true;
      this.isEnabledSubmit = true;
      // loader.style.display = 'block';
      loginErr.style.display = 'none';
      // Login here
      const userData = {
        email: this.email,
        password: this.password
      };
      this.auth.login(userData)
      // .pipe(first())
      .subscribe({
        error: (e) => {
          console.log("I am error signin")
          this.confirmButtonText = "Submit";
          this.isEnabledSubmit = false;
          loginErr.style.display = 'block';
          this.showLoader = false;
          this.isEnabledSubmit = false;
          this.router.navigate(['/']);
        },
        complete: () => {
          this.isEnabledSubmit = false;
          // this.router.navigate(['/dashboard'])
        }
      })
    } else {
      loginErr.style.display = 'block';
      this.showLoader = false;
      this.isEnabledSubmit = false;
    }
  }

  signOut(): void {
    this.socialLoginService.signOut();
  }

  checkm(e) {
    this.email = e;
    const emailId = document.getElementById('emailAddress');
    const emailRedgxPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (emailId != null) {
      if(this.email.match(emailRedgxPattern)) {
        // ✅ Add class
        emailId.classList.remove('is-invalid');
        emailId.classList.add('is-valid');
        this.isInvalidEmail = false; // Hide the tooltip when input is valid
      } else {
        // ✅ Remove class
        emailId.classList.remove('is-valid');
        emailId.classList.add('is-invalid');
        this.isInvalidEmail = true; // Show the tooltip when input is invalid
      }
    }
  }

  checkpw(e) {
    this.password = e;
    const password = document.getElementById('password');
    const passwordRedgcpattern = /^.{6,}$/;

    if (password != null) {
      if(this.password.match(passwordRedgcpattern)) {
        // ✅ Add class
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
        this.isInvalidPassword = false;
      } else {
        // ✅ Remove class
        console.log("I am invalid password")
        password.classList.remove('is-valid');
        password.classList.add('is-invalid');
        this.isInvalidPassword = true;
      }
    }
  }

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }
}
