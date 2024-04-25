import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedservicesService }    from '../../../../services/sharedservices.service';
import { marked } from 'marked';
import * as DOMPurify from 'dompurify';
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

  confirmButtonText: any;
  rejectButtonText: any;
  
  isEnabledSubmit: boolean;
  showLoader: boolean;
  showRejectLoader: boolean;
  accountName: any;
  comments: string;

  constructor(private route: ActivatedRoute, private router: Router, private shared: SharedservicesService) {
    this.confirmButtonText = "Accept";
    this.rejectButtonText = "Reject";
    this.showLoader = false;
    this.showRejectLoader = false;
    this.panelTitle = "Commit";
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log("Params:", params)

      // API call for task id details 
      this.shared.getListCommitDetails(id).subscribe({
          next: async(response) => {
            const responseData = JSON.parse(JSON.stringify(response));
            this.data = responseData;
            this.accountName = this.data.repoName.split('/')[0];
            this.comments = DOMPurify.sanitize(marked(this.data.comments));
          },
          error: (error) => {
            console.log(error);
          }
      });
    })
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
