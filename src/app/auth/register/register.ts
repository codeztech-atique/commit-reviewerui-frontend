import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router }    from '@angular/router';
import { NgForm }    from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Userdetails } from '../../models/user.model';
import appSettings from '../../config/app-settings';
import { AuthenticationService } from '../../auth/authentication.service';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { environment } from '../../../environments/environment';
@Component({
	selector: 'register',
	templateUrl: './register.html',
  styleUrls: ['./register.scss']
})

export class RegisterPage implements OnInit, OnDestroy {
  bg = '/assets/img/login-bg/login-bg-17.jpg';
  appSettings = appSettings;
  email: any;
  password: any;
  username:any;
  confirmButtonText: any;
  isInvalidName: boolean;
  isInvalidEmail: boolean;
  isInvalidPassword: boolean;
  isEnabledSubmit: boolean;

  currentUser: Userdetails;
  currentUserSubscription: Subscription;

  showLoader: boolean;
  showPassword = false;
  socialUser: SocialUser;

  constructor(private router: Router, private renderer: Renderer2,  private auth: AuthenticationService,private titleService: Title, private http: HttpClient, private socialLoginService : SocialAuthService, private route: ActivatedRoute) {
    this.appSettings.appEmpty = true;
    this.isEnabledSubmit = true;
    this.showLoader = false;
    this.confirmButtonText = "Sign me up";
    this.renderer.addClass(document.body, 'bg-white');
  }
  ngOnInit(): void {
    this.titleService.setTitle('Zoom codeguard | Registration Page');


    // for register with linkedin
    this.route.queryParams.subscribe(params => {
      const signUpErr = <HTMLElement>document.getElementById('signup-error');
      const code = params['code'];
      if (code) {
        // Do something with the 'code' parameter
        console.log('Received code frome linkedin register service:', code);
        this.confirmButtonText = "Please wait";
        this.showLoader = true;
        this.isEnabledSubmit = true;
        signUpErr.style.display = 'none';       
      }
    });
  }

  ngOnDestroy() {
    this.appSettings.appEmpty = false;
    this.renderer.removeClass(document.body, 'bg-white');
  }

  checkm(e) {
    this.email = e;
    const emailId = document.getElementById('regEmailAddress');
    const emailRedgxPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (emailId != null) {
      if(this.email.match(emailRedgxPattern)) {
        // ✅ Add class
        emailId.classList.remove('is-invalid');
        emailId.classList.add('is-valid');
        this.isInvalidEmail = false;
        if(this.isInvalidName == false && this.isInvalidPassword == false) {
          this.isEnabledSubmit = false;
        }
      } else {
        // ✅ Remove class
        emailId.classList.remove('is-valid');
        emailId.classList.add('is-invalid');
        this.isInvalidEmail = true;
        this.isEnabledSubmit = true;
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
        if(this.isInvalidEmail == false && this.isInvalidName == false) {
          this.isEnabledSubmit = false;
        }
      } else {
        // ✅ Remove class
        password.classList.remove('is-valid');
        password.classList.add('is-invalid');
        this.isInvalidPassword = true;
        this.isEnabledSubmit = true;
      }
    }
  }

  checkname(e) {
    this.username = e;
    const username = document.getElementById('name');
    const nameRegPattern = /^[A-Za-z0-9\s.,-]{3,}$/;

    if (username != null) {
      if(this.username.match(nameRegPattern)) {
        // ✅ Add class
        username.classList.remove('is-invalid');
        username.classList.add('is-valid');
        this.isInvalidName = false;
        if(this.isInvalidEmail == false && this.isInvalidPassword == false) {
          this.isEnabledSubmit = false;
        }
      } else {
        // ✅ Remove class
        username.classList.remove('is-valid');
        username.classList.add('is-invalid');
        this.isInvalidName = true;
        this.isEnabledSubmit = true;
      }
    }
  }

  register(){
    const signUpErr = <HTMLElement>document.getElementById('signup-error');
    const npattern = /^[A-Za-z0-9\s.,-]{3,}$/;
    const ppattern = /^.{6,}$/;
    const mpattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (this.email && this.password && this.username && this.username.match(npattern) && this.email.match(mpattern) && (this.password.match(ppattern))) {
      const user = {
        "email": this.email,
        "password": this.password,
        "role": "customer",
        "name": this.username,
        "gender": "male",
        "profile": "https://static.analysts24x7.com/profile/user.png",
      }
      
      this.confirmButtonText = "Please wait";
      this.showLoader = true;
      this.isEnabledSubmit = true;
      signUpErr.style.display = 'none';
      
      this.auth.signUp(user).
        pipe(first())
        .subscribe({
          error: (error) => {
            this.isEnabledSubmit = false;
            signUpErr.style.display = 'block';
            console.log('Error in register !!!', error);
          },
          complete: () => {
            this.isEnabledSubmit = false;
            this.router.navigate(['/dashboard'])
            location.reload();
          }
        });
    } else {
      // console.log('conditions not satisfied')
    }
  }

  
  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }

  formSubmit(f: NgForm) {
    this.router.navigate(['dashboard/v3']);
  }

  signUpWithGoogle(): void {
    this.socialLoginService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signUpWithFB(): void {
    this.socialLoginService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  
  signOut(): void {
    this.socialLoginService.signOut();
  }
}
