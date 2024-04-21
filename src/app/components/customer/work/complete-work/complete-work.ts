import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedservicesService }    from '../../../../services/sharedservices.service';
import { CONSTANTS } from '../../../../config/constants';
@Component({
  selector: 'complete-work',
  templateUrl: './complete-work.html'
})

export class Customer_CompletedWork {
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
    
    this.shared.fullFilledOrders(data).subscribe({
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

  downloadFile(index) {
    const customSteps = this.listItems[index]._source.customSteps;
    if(customSteps.length == 6)  { // Quick request
      const providedSolutions = this.listItems[index]._source.bussinessAnalystsUploadedLinks;
      for(let i = 0; i < providedSolutions.length; i++) {
        window.open(providedSolutions[i], "_blank");
      }
    } else { // project request
      const providedSolutions = this.listItems[index]._source.dataAnalystsUploadedLinks;
      for(let i = 0; i < providedSolutions.length; i++) {
        window.open(providedSolutions[i], "_blank");
      }
    }
  }
}
