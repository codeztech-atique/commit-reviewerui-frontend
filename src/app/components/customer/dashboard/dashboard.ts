import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { SharedservicesService } from '../../../services/sharedservices.service';
import { IntroService } from '../../../services/intro.service';
import { DatePipe } from '@angular/common';
import * as introJs from 'intro.js/intro.js';
import Swal from 'sweetalert2';
import global from '../../../config/globals';
import { CONSTANTS } from '../../../config/constants';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})

export class Customer_Dashboard implements OnInit, AfterViewInit {
	global = global;
  data: any;
  totalTime: any;
  subscriptionEndDate: any;
  subscriptionStartDate: any;
  currentUser: any;
  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success btn-width-5',
      cancelButton: 'btn btn-white btn-width-5 mr-left-5'
    },
    buttonsStyling: false
  });

  constructor(private datePipe: DatePipe, private introService: IntroService, private router: Router, private shared: SharedservicesService) {
     this.getDashboardDetails();
  }

  getDashboardDetails() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.shared.getDashboard().subscribe({
      next: async(response) => {
        let responseData = JSON.parse(JSON.stringify(response));
        this.subscriptionEndDate = this.formatDate(responseData.subscriptionEndDate);
        this.subscriptionStartDate = this.formatDate(responseData.subscriptionStartDate);
        this.data = responseData;
        this.currentUser['status'] = this.data.status;
        this.currentUser['balance'] = this.data.totalTime;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      },
      error: (error) => {
        console.log("Error:", error);
      }
    })
  }

  differanceFromRegistation() {
    // Get the current date and time
    var currentDate: Date = new Date();
    var startDateString: string = this.currentUser['custom:sub_startdate'];
    var startDate: Date = new Date(startDateString);

    // Calculate the difference in minutes
    var timeDifferenceInMinutes: number = (currentDate.getTime() - startDate.getTime()) / (1000 * 60);

    // Calculate the difference in milliseconds
    // var timeDifferenceInMilliseconds: number = currentDate.getTime() - startDate.getTime();

    // Define the threshold for 1 year in milliseconds
    // var oneYearInMilliseconds: number = 365 * 24 * 60 * 60 * 1000;

    // Check the conditions
    if(timeDifferenceInMinutes < CONSTANTS.INTRO_SHOW && this.currentUser['custom:selectedPlan'] == 'Freemium-USD-Daily') {
    // if(timeDifferenceInMilliseconds < oneYearInMilliseconds) {
      this.startIntro();
    }
  }

  ngAfterViewInit(): void {
    this.differanceFromRegistation()
  }

  startIntro(): void {
    this.introService.startIntro();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm') || '';
  }
  
  ngOnInit() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }

  subscriptionDetails(subscriptionName: string) {
    let subscription = subscriptionName, infoText = "";
    if(subscription.includes("Base")) {
      infoText = this.data.status == 'Inactive'? "Your current plan has expired. Please recharge your account to continue enjoying the service." : "You are eligible to get 10 hrs of support. Do you want to add more credits?"
    } else if(subscription.includes("Pro")) {
      infoText = this.data.status == 'Inactive'? "Your current plan has expired. Please recharge your account to continue enjoying the service." : "You are eligible to get 20 hrs of support. Do you want to add more credits?"
    } else if(subscription.includes("Pro")) {
      infoText = this.data.status == 'Inactive'? "Your current plan has expired. Please recharge your account to continue enjoying the service." : "You are eligible to get 720 hrs of support."
    } else {
      infoText = this.data.status == 'Inactive'? "Your current plan has expired. Please recharge your account to continue enjoying the service." : "You are eligible to get 7 hrs of support. If you want to add more hours, please upgrade your plan."
    }
    this.swalWithBootstrapButtons.fire({
     title: 'Subscription - '+subscriptionName,
     text: infoText,
     // icon: 'success',
     showConfirmButton: true,
     showCancelButton: true,
     allowOutsideClick: false,
     cancelButtonText: 'Cancel'
   }).then((res) => {
    if (res.value) {
      this.router.navigate([`/balance/add-credit`]);
    }
  })
 }

  subscriptionStartDate_Details(subscriptionName: string, startDate: string) {
     this.swalWithBootstrapButtons.fire({
      title: 'Subscription - '+subscriptionName,
      text: "Your subscription start date is - "+startDate,
      // icon: 'success',
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: 'Cancel'
    })
  }

  subscriptionEndDate_Details(subscriptionName: string, startDate: string) {
    const textData = this.data.status === 'Inactive' ? "Current plan expired, Your subscription end date was - "+startDate : "Your subscription end date is - "+startDate
    this.swalWithBootstrapButtons.fire({
      title: 'Subscription - '+subscriptionName,
      text: textData,
      // icon: 'success',
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: 'Cancel'
    })
  }

  subscription_Balance(subscriptionName: string, totalHrs: string) {
    this.swalWithBootstrapButtons.fire({
      title: 'Subscription - '+subscriptionName,
      text: "You are eligible to get a total of "+totalHrs+" support. Please note that when your balance is less than 10 minutes, you will not be able to create requests. Due to the low balance, we suggest adding more credit for a seamless experience.",
      // icon: 'success',
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: 'Cancel'
    })
  }

  totalUploads(totalUpload: number) {
    this.swalWithBootstrapButtons.fire({
      title: 'Total Upload',
      text: "Your total uploads till now are "+totalUpload,
      // icon: 'success',
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: 'Cancel'
    })
  }
}
