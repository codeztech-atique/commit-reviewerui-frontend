import { Component, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'open-issue',
  templateUrl: './open-issue.html'
})

export class Customer_OpenIssue {
  rows = [];
  temp = [];
  code = `<!-- page.ts -->
import { TableData } from './data';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

export class TableDataPage {
  columns = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  ColumnMode = ColumnMode;

  constructor() {
    this.fetch(data => {
      // cache our list
      this.temp = [...data];

      // push our inital complete list
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/company.json');

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
}

<!-- page.html -->
<ngx-datatable
  #table
  class="bootstrap"
  [columns]="columns"
  [columnMode]="ColumnMode.force"
  [headerHeight]="50"
  [footerHeight]="50"
  rowHeight="auto"
  [limit]="10"
  [rows]="rows"></ngx-datatable>
`;

  columns = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  ColumnMode = ColumnMode;

  constructor() {
    this.fetch(data => {
      // cache our list
      this.temp = [...data];

      // push our inital complete list
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
