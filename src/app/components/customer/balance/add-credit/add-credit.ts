import { Component, Inject, Injectable, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SharedservicesService }    from '../../../../services/sharedservices.service';
import { AuthenticationService } from "../../../../auth/authentication.service";
import { ChargebeeService } from '../../../../services/chargebee.service';
import { CommonService }    from '../../../../services/common.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'add-credit',
  templateUrl: './add-credit.html',
  styleUrls: ['./add-credit.scss'],
  host: {
    '(document:click)': 'closeDropdownOnclickOutside($event)',
  }
})

export class Customer_AddCredit {
  currentUserSubscription: Subscription;
  showSuccessMessage: boolean;
  showFailureMessage: boolean;
  totalHrs: any;
  trasactionSuccessMsg: any;
  trasactionFailedMsg: any;
  selectedPlan: any;
  showPlan:boolean;
  chargebeePlans: any;
  chargebeeUpdateSubscription: any;
  upgradeObj: any;
  hostedPageid: any;
  chargeBeeResponse: any;
  status: any;
  balance: any;
  enableButton: boolean;
  otp: any;
  planPrice : any = null;
  EnterPricePlantype: boolean;
  currentUser: any;
  userCurrentPlan: any;


  constructor(private shared: SharedservicesService, private authenticationService: AuthenticationService, private commonService: CommonService, private auth: AuthenticationService, private chargebeeService:ChargebeeService, private router: Router, private route: ActivatedRoute){
    this.showSuccessMessage = false;
    this.showFailureMessage = false;
    this.enableButton = false;
    this.showPlan = false;
    

    // this.chargebeeService.getAllPlans().subscribe((data)=>{
    //   this.chargebeePlans = data;
    // })

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      if(this.currentUser['custom:selectedPlan'] === 'Freemium-USD-Daily') {
        this.selectedPlan = 'Trail';
        this.enableButton = true;
      } else if(this.currentUser['custom:selectedPlan'] === 'Base-Plan-Monthly') {
        this.selectedPlan = `Base`;
      } else if(this.currentUser['custom:selectedPlan'] === 'Pro-Plan-Monthly') {
        this.selectedPlan = `Pro`;
      } else {
        this.selectedPlan = `Enterprise`;
      }

      // Fetch plans and handle it inside the subscription
      this.chargebeeService.getAllPlans().subscribe((data) => {
        this.chargebeePlans = data;
        this.status = this.currentUser.status === 'Inactive' ? 'Your plan has expired .' : 'Active';
        this.balance = this.currentUser.balance;

        // Find the selected plan in chargebeePlans
        const selectedPlanInfo = this.chargebeePlans.find((plan) => plan.name === this.selectedPlan);


        // Check if the plan is found
        if (selectedPlanInfo) {
          // Use selectedPlanInfo for further processing
          this.planPrice = selectedPlanInfo.price;
          // Access other properties as needed
        } else {
          // Handle case when the plan is not found
          console.error(`Plan "${this.selectedPlan}" not found in chargebeePlans`);
        }
      });
      
    });
  }



  @ViewChild('selectsPlan') selectsPlan: ElementRef;
  closeDropdownOnclickOutside(event: MouseEvent) {
    if (!this.selectsPlan?.nativeElement.contains(event.target as Node)) {
      this.showPlan = false;
    }
  }

  showDropDownPlan() {
    if(this.showPlan) {
      this.showPlan = false;
    } else {
      this.showPlan = true;
    }
  }

  choosePlan(index) {
    this.selectedPlan = this.chargebeePlans[index].name;
    this.planPrice = this.chargebeePlans[index].price;
    this.enableButton = false;
    if(this.chargebeePlans[index].name == "Enterprise"){
      this.EnterPricePlantype = true;
      this.planPrice = 0;
    } else{
      this.EnterPricePlantype = false;
    }

  }

  async updateSubscriptionAPICall(upgradeObj) {
    try {
      const observable = await this.chargebeeService.updateChargeBeeSubscription(upgradeObj);
      const data = await lastValueFrom(observable);
      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  upgradeSubscription(){
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if(!this.currentUser.email_verified){
      this.verifyOtp()
    } else{
      var cbInstance = window['Chargebee'].getInstance()
      cbInstance.openCheckout({
        hostedPage: async () => {
          const getUserSubscriptionDetails = JSON.parse(localStorage.getItem('currentUser'));
          this.upgradeObj = {
            subscriptionId: getUserSubscriptionDetails["custom:subscriptionId"], // Your current subscription Id
            user_id: getUserSubscriptionDetails["custom:subscriber_user_id"], // Is your customer Id
            selectedPlan: this.selectedPlan
          }
          const res = await this.updateSubscriptionAPICall(this.upgradeObj);
          this.hostedPageid = res.id
          return res
        },
        loaded: () => {
          console.log("checkout opened");
        },
        close: () => {
            console.log("checkout closed");
        },
        success: async () => {
          cbInstance.closeAll();
          // let res =  await this.chargebeeService.send('updateSubscriptionInDb',this.upgradeObj)
          // console.log("success_res",res)
          // console.log("success api called")

         
          if(this.upgradeObj.selectedPlan === 'Base') {
             this.trasactionSuccessMsg = 'Now you can enjoy '+this.upgradeObj.selectedPlan+' plan next 30 days for '+10+' hrs of support.';
             this.totalHrs = 10;
          } else if(this.upgradeObj.selectedPlan === 'Pro') {
            this.trasactionSuccessMsg = 'Now you can enjoy '+this.upgradeObj.selectedPlan+' plan next 30 days for '+20+' hrs of support.';
            this.totalHrs = 20;
          }

          let currUser = {
            ...this.currentUser
          }

          delete currUser.accessToken;
          delete currUser.refreshToken;
          delete currUser.idToken;
          delete currUser.id;


          const obj = {
            ...currUser,
            selectedPlan: this.upgradeObj.selectedPlan,
          }

          this.chargebeeService.updatePlans(obj).subscribe({
              next: (response) => {
                // Handle the response here
                this.currentUser['custom:selectedPlan'] = response.subscriptionName;
                this.currentUser['custom:sub_startdate'] = response.subscriptionStartDate;
                this.currentUser['custom:sub_enddate'] = response.subscriptionEndDate;
                this.currentUser['status'] = 'active';
                this.currentUser['balance'] = this.totalHrs;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                // You can access the response data using response.data or other appropriate properties.
              },
              error: (e) => {
                console.log("Error:", e);
                  this.router.navigate(['/balance/add-credit']);
              },
              complete: () => {
                this.commonService.updateSubscriptionDetails(this.currentUser);
                this.router.navigate(['/file/upload']);
              }
            })

          // Update in local Storage - 

          // Make API call - Update in the cognito and database level

          // if(res.body.user_updated) {
          // this.dialog.closeAll();
          // this.window.location.reload();
          // }
          // Hosted page id will be unique token for the checkout that happened
          // You can pass this hosted page id to your backend 
          // and then call our retrieve hosted page api to get subscription details
          // https://apidocs.chargebee.com/docs/api/hosted_pages#retrieve_a_hosted_page
         
          this.showFailureMessage = false;
          this.showSuccessMessage = true;

          // setTimeout(() => {
          //   this.showSuccessMessage = false;
          // }, 3000);


        },
        step: (value: any) => {
            // value -> which step in checkout
            console.log("Steps for checkout:", value);
            this.trasactionFailedMsg = "Please do not close the popup, until your transaction completed.";

            this.showFailureMessage = true;
            this.showSuccessMessage = false;
            // setTimeout(() => {
            //   this.showFailureMessage = false;
            // }, 3000)
        }
      });
    }
    
  }



  verifyOtp() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success btn-width-5',
            cancelButton: 'btn btn-white btn-width-5 mr-left-5'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: 'Do you want to proceed ?',
        text: 'Please verify the email',
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonText: 'Cancel'
    }).then((res) => {
        if (res.isConfirmed) {
            swalWithBootstrapButtons.fire({
                title: 'Enter OTP',
                html: `
                    <style>
                        /* Remove increment and decrement buttons */
                        input[type="number"]::-webkit-inner-spin-button,
                        input[type="number"]::-webkit-outer-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                        }

                        input[type="number"] {
                            -moz-appearance: textfield;
                        }
                    </style>
                    <div class="d-flex justify-content-between p-3">
                        <input type="text" id="otp1" class="form-control form-control-lg mw-100 text-center py-2 mx-2" maxlength="1" autofocus>
                        <input type="text" id="otp2" class="form-control form-control-lg mw-100 text-center py-2 mx-2" maxlength="1">
                        <input type="text" id="otp3" class="form-control form-control-lg mw-100 text-center py-2 mx-2" maxlength="1">
                        <input type="text" id="otp4" class="form-control form-control-lg mw-100 text-center py-2 mx-2" maxlength="1">
                    </div>

                `,
                focusConfirm: false,
                didOpen: () => {
                    const handleInput = (e: any) => {
                        const target = e.target;
                        if (target.value.length >= 1) {
                            const nextInput = target.nextElementSibling;
                            if (nextInput && nextInput.tagName === 'INPUT') {
                                nextInput.focus();
                            }
                        } else if (e.inputType === "deleteContentBackward") {
                            const prevInput = target.previousElementSibling;
                            if (prevInput && prevInput.tagName === 'INPUT') {
                                (prevInput as HTMLInputElement).focus();
                            }
                        }
                    };

                    console.log("Send email here 1")

                    this.sendOTP_toEmail();

                    document.getElementById('otp1')?.addEventListener('input', handleInput);
                    document.getElementById('otp2')?.addEventListener('input', handleInput);
                    document.getElementById('otp3')?.addEventListener('input', handleInput);
                    document.getElementById('otp4')?.addEventListener('input', handleInput);
                },
                preConfirm: () => {
                    console.log("Send email here 2:")
                    
                    return [
                        (document.getElementById('otp1') as HTMLInputElement).value,
                        (document.getElementById('otp2') as HTMLInputElement).value,
                        (document.getElementById('otp3') as HTMLInputElement).value,
                        (document.getElementById('otp4') as HTMLInputElement).value
                    ]
                },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.value) {
                    this.otp = result.value.join('');
                   
                    swalWithBootstrapButtons.fire({
                      title: "Verifying email",
                      imageUrl: "../../../assets/img/extra/loading.gif",
                      imageWidth: 80,
                      text: 'Please wait',
                      showConfirmButton: false,
                      showCancelButton: false,
                      allowOutsideClick: false,
                    });

                    this.verifyNow();
                }
            });
        }
    })
  }

  sendOTP_toEmail() {
    const userDetails = JSON.parse(localStorage.getItem('currentUser'));
    const userData = {
      id: userDetails['cognito:username'],
      email: userDetails['email'],
      name: userDetails['custom:name']
    }
    this.shared.sendVerificationCode(userData)
      .subscribe({
        error: (e) => {
        
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success btn-width-5',
              cancelButton: 'btn btn-white btn-width-5 mr-left-5'
            },
            buttonsStyling: false
          });


          swalWithBootstrapButtons.fire({
            title: 'Error !',
            text: e,
            icon: 'error',
            showConfirmButton: false,
            showCancelButton: true,
            allowOutsideClick: false,
            cancelButtonText: 'Cancel'
          })
        },
        complete: () => {
          console.log("Mail send successfully.")
        }
    })
  }


  verifyNow() {
    const userDetails = JSON.parse(localStorage.getItem('currentUser'));
    const userData = {
      id: userDetails['cognito:username'],
      email: userDetails['email'],
      code: this.otp
    }

    this.auth.verifyEmail(userData)
      .subscribe({
        error: (e) => {
          this.router.navigate(['/balance/add-credit']);
   
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success btn-width-5',
              cancelButton: 'btn btn-white btn-width-5 mr-left-5'
            },
            buttonsStyling: false
          });


          swalWithBootstrapButtons.fire({
            title: 'Error !',
            text: 'We encountered an issue sending the OTP to your email. Please try again.',
            icon: 'error',
            showConfirmButton: false,
            showCancelButton: true,
            allowOutsideClick: false,
            cancelButtonText: 'Cancel'
          })
        },
        complete: () => {
          userDetails['email_verified'] = true;
          localStorage.setItem('currentUser', JSON.stringify(userDetails));
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 3000)
        }
    })
  
  }
}
