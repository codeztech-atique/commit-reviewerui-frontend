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
        // this.subscriptionEndDate = this.formatDate(responseData.subscriptionEndDate);
        // this.subscriptionStartDate = this.formatDate(responseData.subscriptionStartDate);
        this.data = responseData;
        // this.currentUser['status'] = this.data.status;
        // this.currentUser['balance'] = this.data.totalTime;
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
    var startDateString: string = this.currentUser['custom:createdAt'];
    var startDate: Date = new Date(startDateString);

    // Calculate the difference in minutes
    var timeDifferenceInMinutes: number = (currentDate.getTime() - startDate.getTime()) / (1000 * 60);

    // Calculate the difference in milliseconds
    // var timeDifferenceInMilliseconds: number = currentDate.getTime() - startDate.getTime();

    // Define the threshold for 1 year in milliseconds
    // var oneYearInMilliseconds: number = 365 * 24 * 60 * 60 * 1000;

    // Check the conditions
    if(timeDifferenceInMinutes < CONSTANTS.INTRO_SHOW) {
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

  totalGithubAccount(totalGitHubAccountCount: number) {
    const textData = `You currently manage a total of ${totalGitHubAccountCount} GitHub accounts.`;
    this.swalWithBootstrapButtons.fire({
        title: 'Total GitHub Accounts Overview',
        text: textData,
        // icon: 'info',  // Uncomment and choose an appropriate icon if needed
        showConfirmButton: false,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonText: 'Close'  // Changed from 'Cancel' to 'Close' to better reflect the action
    }).then((res) => {
      if (res.value) {
        this.router.navigate([`/account/add`]);
      }
    });
 }

  totalRepository(totalRepoCount: number) {
    const textData = `You currently manage a total of ${totalRepoCount} repositories across all your accounts.`;
    this.swalWithBootstrapButtons.fire({
        title: 'Total Repositories Overview',
        text: textData,
        // icon: 'info',  // Uncomment and choose an appropriate icon if needed
        showConfirmButton: false,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonText: 'Close'  // Changed from 'Cancel' to 'Close' to better reflect the action
    });
  }

  totalCommits(totalCommitsCount: number) {
    const textData = `You have made a total of ${totalCommitsCount} commits across all your repositories and accounts.`;
    this.swalWithBootstrapButtons.fire({
      title: 'Total Commits Overview',
      text: textData,
      // icon: 'info',  // Uncomment and change to 'info' or appropriate icon if needed
      showConfirmButton: false,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: 'Close'
    })
  }

  totalApprovedPR(totalApprovedPRCount: number) {
    const textData = `You have a total of ${totalApprovedPRCount} approved pull requests across all your repositories.`;
    this.swalWithBootstrapButtons.fire({
        title: 'Total Approved Pull Requests Overview',
        text: textData,
        // icon: 'info',  // Uncomment and choose an appropriate icon if needed
        showConfirmButton: false,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonText: 'Close'  // Changed from 'Cancel' to 'Close' to better reflect the action
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
