import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedservicesService }    from '../../../../services/sharedservices.service';
import  { addTime, timeDifference, totalHoursRoundOf } from '../../../../utils/index';
import { CONSTANTS } from '../../../../config/constants';
import Swal from 'sweetalert2';
@Component({
  selector: 'commit-details',
  templateUrl: './commit-details.html',
  styleUrls: ['commit-details.scss']
})

export class Customer_CommitDetails {
  panelTitle: any;
  customSteps: any;
  data: any;
  currentPlan: any;
 
  currentStatus: any;
  confirmButtonText: any;
  rejectButtonText: any;

  workingOnPast: string;
  amountSpend: number;
  
  isEnabledSubmit: boolean;
  showLoader: boolean;
  showRejectLoader: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private shared: SharedservicesService) {
    this.confirmButtonText = "Accept";
    this.rejectButtonText = "Reject";
    this.showLoader = false;
    this.showRejectLoader = false;
    this.panelTitle = "Task Details";
    this.route.params.subscribe(params => {
      let id = params['id'];
      
      // API call for task id details 
      this.shared.taskDetails(id).subscribe({
        next: async(response) => {
          const responseData = JSON.parse(JSON.stringify(response));
          this.data = responseData;
          this.customSteps = this.data.customSteps;
          this.currentStatus = this.data.currentStatus;

          // Get the plan details - 
          if(this.data.currentPlan == 'Freemium-USD-Daily') {
            this.currentPlan = "Plan - Freemium";
          } else if(this.data.currentPlan == 'Base-Plan-Monthly') {
            this.currentPlan = "Plan - Base";
          } else if(this.data.currentPlan == 'Pro-Plan-Monthly') {
            this.currentPlan = "Plan - Pro";
          } else if(this.data.currentPlan == 'Enterprise-Plan-Monthly') {
            this.currentPlan = "Plan - Enterprise";
          } 
         
          // Check if it is rejected task
          if(this.data.isRejected) {
            this.panelTitle = "Rejected Work Details";
          } else {
            this.panelTitle = "Task Details";
          }

          // Quick request
          if(this.data.customSteps.length == 6) {
            if(this.currentStatus.stepNo == 3) {
              if(this.data.spendTimeByBussinessAnalysts != "") {
                const businessAnalystsStartWorking = addTime(this.data.spendTimeByBussinessAnalysts, this.data.bussinessAnalysts_StartedWorking);
                this.workingOnPast = timeDifference(businessAnalystsStartWorking,  new Date().getTime());
              } else {
                this.workingOnPast = timeDifference(parseInt(this.data.bussinessAnalysts_StartedWorking),  new Date().getTime())
              }
              
            } else if(this.currentStatus.stepNo >= 4){
              // this.workingOnPast = timeDifference(parseInt(this.data.bussinessAnalysts_StartedWorking),  parseInt(this.data.bussinessAnalysts_CompletedWork));
              this.workingOnPast = this.data.spendTimeByBussinessAnalysts;
              // this.amountSpend = totalHoursRoundOf(this.workingOnPast) * CONSTANTS.WE_CHARGE_PER_HOUR;
              this.amountSpend = this.data.amountSpend;
            }
          } else { // Project request
            if(this.currentStatus.stepNo == 4) {
              if(this.data.spendTimeByDataAnalysts != "") {
                const dataAnalystsStartWorking = addTime(this.data.spendTimeByDataAnalysts, this.data.dataAnalysts_StartedWorking);
                this.workingOnPast = timeDifference(dataAnalystsStartWorking,  new Date().getTime());
              } else {
                this.workingOnPast = timeDifference(parseInt(this.data.dataAnalysts_StartedWorking),  new Date().getTime())
              }
            } else if(this.currentStatus.stepNo >= 5){
              // this.workingOnPast = timeDifference(parseInt(this.data.dataAnalysts_StartedWorking),  parseInt(this.data.dataAnalysts_CompletedWork));
              this.workingOnPast = this.data.spendTimeByDataAnalysts;
              // this.amountSpend = totalHoursRoundOf(this.workingOnPast) * CONSTANTS.WE_CHARGE_PER_HOUR;
              this.amountSpend = this.data.amountSpend;
            }
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    });
  }

  confirmSubmit() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success btn-width-5',
        cancelButton: 'btn btn-white btn-width-5 mr-left-5'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to accept?',
      text: 'This process steps is irreversible.',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: 'Cancel'
    }).then((res) => {
      if (res.value) {
        swalWithBootstrapButtons.fire(
          'Success!',
          'You have made it.',
          'success'
        )
      }
    })
  }


  rejectWork() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success btn-width-5',
        cancelButton: 'btn btn-white btn-width-5 mr-left-5'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure want to reject?',
      text: 'This process steps is irreversible.',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonText: 'Cancel'
    }).then((res) => {
      if (res.value) {
        swalWithBootstrapButtons.fire(
          'Success!',
          'You have made it.',
          'success'
        )
      }
    })
  }
  
}
