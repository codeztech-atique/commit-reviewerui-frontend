import { Component, OnInit, OnDestroy, ViewChildren, Renderer2} from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../auth/authentication.service";
import { HttpClient } from "@angular/common/http";
import { first } from 'rxjs/operators';
import appSettings from "../../config/app-settings";
import { Title } from '@angular/platform-browser';

@Component({
  selector: "otp",
  templateUrl: "./otp.html",
  styleUrls: ["./otp.scss"],
})

export class OtpPage implements OnInit {
  bg = "/assets/img/login-bg/login-bg-17.jpg";
  app;
  appSettings = appSettings;
  apiResponseMessage: any;
  form: any;
  digits: string[] = ['', '', '', ''];
  

  constructor(
    private router: Router, private auth: AuthenticationService, private http: HttpClient, private titleService: Title, private renderer: Renderer2 ) {
    this.form = this.toFormGroup(this.formInput);
    this.appSettings.appEmpty = true;
    this.renderer.addClass(document.body, 'bg-white');
  }
  ngOnInit(): void {
    this.titleService.setTitle('Analysts24 X 7 | Varification Page');
  }

  formInput = ["input1", "input2", "input3", "input4"];
  @ViewChildren("formRow") rows: any;

  toFormGroup(elements) {
    const group: any = {};
    elements.forEach((key) => {
      group[key] = new FormControl("", Validators.required);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event, index) {
    const inputValue = event.target.value;

    // Handle navigation between input fields (left/right) for arrow keys and Backspace
    let pos = index;
    if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
      pos = index - 1;
    } else if (event.key === 'ArrowRight') {
      pos = index + 1;
    }

    if (pos < 0) {
      pos = this.formInput.length - 1; // Wrap around to the last input field
    } else if (pos >= this.formInput.length) {
      pos = 0; // Wrap around to the first input field
    }

    // Set focus on the calculated position
    this.rows._results[pos].nativeElement.focus();

    if (event.key === 'Backspace') {
      // Clear the digit if Backspace is pressed
      this.digits[index] = '';
    } else if (inputValue.length === 1 && /^\d$/.test(inputValue)) {
      // Update the corresponding digit in the array
      this.digits[index] = inputValue;
      
      // Automatically move the cursor to the next input field
      const nextIndex = (index + 1) % this.formInput.length;
      this.rows._results[nextIndex].nativeElement.focus();
    }
  }

  pasteEvent(event: any, startIndex: number) {
    event.preventDefault();
    const clipboardData = event.clipboardData || window['clipboardData'];
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      const digits = pastedText.match(/\d/g); // Extract only digits

      if (digits && digits.length <= this.formInput.length - startIndex) {
        // Distribute the pasted digits across the input fields
        for (let i = startIndex, j = 0; i < this.formInput.length && j < digits.length; i++, j++) {
          this.form.controls[this.formInput[i]].setValue(digits[j]);
          this.digits[i] = digits[j];
        }
        
        // Set focus to the fourth input box after a brief delay
        setTimeout(() => {
          this.rows._results[startIndex + digits.length].nativeElement.focus();
        }, 0);
      }
    }
  }

  verifyLater() {
    location.reload(); // Important line, Refresh page after login --- We have to refresh all the routes
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 3000)
  }

  verifyNow() {
    const userDetails = JSON.parse(localStorage.getItem('currentUser'));
    let isSuccess = false; // Flag to indicate success
    const userData = {
      id: userDetails['cognito:username'],
      email: userDetails['email'],
      code: this.digits.join('')
    }
    this.auth.verifyEmail(userData)
      .pipe(first())
      .subscribe({
        error: (e) => {
          isSuccess = false;
          this.apiResponseMessage = e;
          this.router.navigate(['/otp']);
        },
        complete: () => {
          isSuccess = true; 
          this.changeTextColor(isSuccess);
          userDetails['email_verified'] = true;
          localStorage.setItem('currentUser', JSON.stringify(userDetails));
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 3000)
        }
    })
  }

  changeTextColor(isSuccess: boolean) {
    const messageElement = document.getElementById('verify-otp-message');
    if (isSuccess) {
      messageElement.style.color = 'green'; // Set text color to green for success
    } else {
      messageElement.style.color = 'red'; // Set text color to red for failure
    }
  }

  ngOnDestroy() {
    this.appSettings.appEmpty = false;
    this.renderer.removeClass(document.body, 'bg-white');
  }
}
