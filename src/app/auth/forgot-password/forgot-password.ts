import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router }    from '@angular/router';
import { NgForm }    from '@angular/forms';
import appSettings from '../../config/app-settings';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
	selector: 'forgot-password',
	templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})

export class ForgotPassword implements OnInit, OnDestroy {
  bg = '/assets/img/login-bg/login-bg-17.jpg';
  appSettings = appSettings;
  email: any;
  apiResponseError: any;
  confirmButtonText: any;
  isDisabled: boolean;
  isInvalidEmail: boolean;
  showLoader: boolean;

  constructor(private router: Router, private renderer: Renderer2, private titleService: Title, private auth: AuthenticationService) {
    this.appSettings.appEmpty = true;
    this.isDisabled = true;
    this.showLoader = false;
    this.confirmButtonText = "Send Email";
    this.renderer.addClass(document.body, 'bg-white');
  }
  ngOnInit(): void {
    this.titleService.setTitle('Analysts24 X 7 | Forgot Password Page');
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
        this.isDisabled = false;
      } else {
        // ✅ Remove class
        emailId.classList.remove('is-valid');
        emailId.classList.add('is-invalid');
        this.isInvalidEmail = true;
        this.isDisabled = true;
      }
    }
  }

  forgotPassword() {
    this.showLoader = true;
    this.confirmButtonText = "Please wait";
    const forgotPasswordHTMLError = <HTMLElement>document.getElementById('forgot-password-error');
    const userData = {
      email: this.email
    }
    this.auth.forgotPassword(userData)
      // .pipe(first())
      .subscribe({
        error: (e) => {
          // apiResponseError
          this.apiResponseError = e;
          forgotPasswordHTMLError.style.display = 'block';
          this.confirmButtonText = "Send Email";
          this.showLoader = false;
          this.router.navigate(['/forgot-password']);
        },
        complete: () => {
          console.log("Forgot password link has shared to your email id.");
        },
        next: (res) => {
          
          // Map and process the response as needed
          const response = JSON.parse(JSON.stringify(res));
          this.apiResponseError = response.message;
          this.confirmButtonText = "Send Email";
          this.showLoader = false;
        }
    })
  }
}
