import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedservicesService }    from '../../../../services/sharedservices.service';
import { CONSTANTS } from '../../../../config/constants';
@Component({
  selector: 'quick-request',
  templateUrl: './quick-request.html',
  styleUrls: ['./quick-request.scss']
})

export class Customer_QuickRequest_List implements OnInit{
  listItems : any;
  fromPage: Number;
  totalSize: Number;
  dtoptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

	constructor(private shared: SharedservicesService) {
    this.fromPage = CONSTANTS.PAGESTARTS_FROM;
    this.totalSize = CONSTANTS.PAGESIZE;
  }

  ngOnInit(): void {
    // DataTables Settings - 
    this.dtoptions = {
      lengthMenu: [10, 20, 40, 60, 80, 100],
      responsive: true.valueOf,
      pagingType: 'simple_numbers', // simple // simple_numbers // full // full_numbers
      order:[[1, 'desc']],
      // searching: false,
      // paging: false,
      // lengthChange: false, // Remove select options
      
      language: {
        searchPlaceholder: 'Search your order' // To Search in the search placeholder
      }
    }
    this.listData();
  }

  listData() {
    const data = {
      from: this.fromPage,
      size: this.totalSize
    }
    
    this.shared.getlistUpload(data).subscribe({
      next: async(response) => {
        const responseData = JSON.parse(JSON.stringify(response));
        this.listItems = responseData;
        this.dtTrigger.next(null);
        
      },
      error: (error) => {
        console.log(error);
        this.listItems = [];
        this.dtTrigger.next(null);
      }
    })
  }
}
