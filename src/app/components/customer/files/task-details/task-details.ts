import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedservicesService }    from '../../../../services/sharedservices.service';
import  { addTime, timeDifference, totalHoursRoundOf } from '../../../../utils/index';
import { CONSTANTS } from '../../../../config/constants';
import { WebSocketService }  from '../../../../services/websockets.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'task-details',
  templateUrl: './task-details.html',
  styleUrls: ['task-details.scss']
})

export class Customer_TaskDetails {
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

  constructor(private route: ActivatedRoute, private router: Router, private shared: SharedservicesService, private wbsocketService: WebSocketService) {
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
        this.acceptRequest();
      }
    })
  }

  acceptRequest() {
    const reviewCompletedAcceptDeal = this.data;
    this.isEnabledSubmit = true;
    this.confirmButtonText = "Please wait";
    this.showLoader = true;

    if(this.data.customSteps.length == 6) { // Quick request
      reviewCompletedAcceptDeal.customSteps[4].status = "completed";
      reviewCompletedAcceptDeal.customSteps[5].status = "completed";
      reviewCompletedAcceptDeal.currentStatus = reviewCompletedAcceptDeal.customSteps[5];
    } else { // Project request
      reviewCompletedAcceptDeal.customSteps[6].status = "completed";
      reviewCompletedAcceptDeal.customSteps[7].status = "completed";
      reviewCompletedAcceptDeal.currentStatus = reviewCompletedAcceptDeal.customSteps[7];
    }

    reviewCompletedAcceptDeal.currentlyWith = {
      id: this.data.id,
      email: this.data.email,
      name: this.data.name,
      role: this.data.role
    };

    reviewCompletedAcceptDeal.status = false; 
    
    this.shared.acceptDeal(reviewCompletedAcceptDeal).subscribe({
      next: async(response) => {
        const responseData = JSON.parse(JSON.stringify(response));
        // Websockets integration here --- 
        // 1. Send push notification to customer, bussiness analysts, and data analysts
        
        
        let messageToSend = this.data.name+""+CONSTANTS.CUSTOMER_REVIEW_COMPLETED.body;
        let sendRoomMessage = {
          action: "sendroom",
          message: {
            sendRoomToAssignedPeople: true,
            title: CONSTANTS.CUSTOMER_REVIEW_COMPLETED.title,
            body: messageToSend
          },
          roomid: this.data.id,
          userid: this.data.userid
        }
        
        this.wbsocketService.send(sendRoomMessage);

      
        // Redirection with task details
        setTimeout(() => {
          this.router.navigate([`/completed/work`]);
        }, 5000)
      },
      error: (error) => {
        console.log(error);
      }
    });
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
        this.rejectRequest();
      }
    })
  }
  
  rejectRequest() {
    this.isEnabledSubmit = true;
    this.rejectButtonText = "Please wait";
    this.showRejectLoader = true;

    this.shared.rejectWork(this.data).subscribe({
      next: async(response) => {
        const responseData = JSON.parse(JSON.stringify(response));
        console.log("responseData:", responseData);
        // Websockets integration here --- 
        // 1. Send push notification to customer, bussiness analysts, and data analysts
        
        
        let messageToSend = this.data.name+""+CONSTANTS.CUSTOMER_REJECTED_WORK.body;
        let sendRoomMessage = {
          action: "sendroom",
          message: {
            sendRoomToAssignedPeople: true,
            title: CONSTANTS.CUSTOMER_REJECTED_WORK.title,
            body: messageToSend
          },
          roomid: this.data.id,
          userid: this.data.userid
        }
        
        this.wbsocketService.send(sendRoomMessage);

      
        // Redirection with task details
        setTimeout(() => {
          if(this.data.customSteps.length === 6) {
            this.router.navigate([`/task/quick-request/list`]);
          } else if(this.data.customSteps.length === 8) {
            this.router.navigate([`/task/project-request/list`]);
          }
          
        }, 5000)
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  
}
