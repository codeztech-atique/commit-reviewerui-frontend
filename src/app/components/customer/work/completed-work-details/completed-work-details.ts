import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedservicesService }    from '../../../../services/sharedservices.service';
import { WebSocketService }  from '../../../../services/websockets.service';


@Component({
  selector: 'completed-work-details',
  templateUrl: './completed-work-details.html',
  styleUrls: ['completed-work-details.scss']
})

export class Customer_CompletedWorkDetails {
	customSteps: any;
  data:any;
  currentStatus: any;
  currentPlan: any;
  workingOnPast: string;
  amountSpend: number;
  isEnabledSubmit: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private shared: SharedservicesService, private wbsocketService: WebSocketService) {
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

          if(this.customSteps.length == 6) { // Quick request
            this.workingOnPast = this.data.spendTimeByBussinessAnalysts;
          } else { // Project request
            this.workingOnPast = this.data.spendTimeByDataAnalysts;
          }
          this.amountSpend = this.data.amountSpend;
        },
        error: (error) => {
          console.log(error);
        }
      })
    });
    // console.log(this.data)
  }
}
