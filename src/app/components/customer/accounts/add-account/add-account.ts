
import { Component, OnInit, ViewChild, ElementRef, OnDestroy }          from '@angular/core';
import { Router }                                       from "@angular/router";
import { 
  customStepsQuickRequest, 
  customStepsProjectRequest, 
  approximateTimeLine,
  doYouHaveFile,
  whatYouWantedToUpload
}                                                       from '../../../../data/data';
import { CONSTANTS }                                    from '../../../../config/constants';
import { CommonService }                                from '../../../../services/common.service';
import { formatBytes, getFileExtension }                                  from '../../../../utils/index';
import { SharedservicesService }                        from '../../../../services/sharedservices.service';
import { AuthenticationService } from '../../../../auth/authentication.service';
import { Subscription } from 'rxjs';
import { Userdetails } from '../../../../models/user.model';
import { ToastService } from '../../../../services/toast.service'; 

import Swal from 'sweetalert2';
import * as uuid from 'uuid';


@Component({
  selector: 'add-account',
  templateUrl: './add-account.html',
  styleUrls: ['./add-account.scss'],
  host: {
    '(document:click)': 'closeDropdownOnclickOutside($event)',
  }
})

export class Add_Account implements OnInit, OnDestroy {
    confirmButtonText: any;
    currentUser: Userdetails;
    currentUserSubscription: Subscription;
    upcomingUserSubscription: Subscription;
    showLoader: boolean;
    showCategory: boolean;
   
    constructor(private commonService : CommonService, private toastService: ToastService, private router: Router, private shared: SharedservicesService,  private authenticationService: AuthenticationService ) {
      this.showLoader = false;
      this.confirmButtonText = "Submit"
      //this.upcomingUserSubscription = 
      this.commonService.subjectSubscription$.subscribe((data) => {
        const res = JSON.parse(JSON.stringify(data));
      });
    }


    ngOnInit(): void {
      // this.socketService.setupSocketConnection();
      
    }

    confirmSubmit() {

    }

    @ViewChild('selectCatagory') selectCatagory: ElementRef;
    @ViewChild('selectApproxTimeline') selectApproxTimeline: ElementRef;
    @ViewChild('doYouHaveFile') doYouHaveFile: ElementRef;
    @ViewChild('fileOrLink') fileOrLink: ElementRef;
    closeDropdownOnclickOutside(event: MouseEvent) {
      if (!this.selectCatagory?.nativeElement.contains(event.target as Node)) {
        this.showCategory = false;
      }
    }


    ngOnDestroy() {
      // this.upcomingUserSubscription.unsubscribe();
      this.currentUserSubscription.unsubscribe();
    }
}
