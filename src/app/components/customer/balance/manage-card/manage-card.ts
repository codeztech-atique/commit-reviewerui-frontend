import { Component, Injectable, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { Editor } from 'ngx-editor';
import { ColorEvent } from 'ngx-color';
import Tagify from '@yaireo/tagify';

// for ngb datepicker adapter
@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    return (date && date.getFullYear) ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }
}

@Component({
  selector: 'manage-card',
  templateUrl: './manage-card.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}],
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './manage-card.css' ]
})

export class Customer_ManageCard implements OnInit, OnDestroy {
  // ngx-editor
  editor: Editor;
  html: '';
  
  // ngbdatepicker
  model1: Date;
  model2: Date;
  get today() {
    return new Date();
  }
  
  // ngx-color
  color;

  // ngbtimepicker
  time = {hour: 13, minute: 30};
  time2;
  meridian = true;
  toggleMeridian() {
    this.meridian = !this.meridian;
  }
  ctrl = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (value.hour < 12) {
      return {tooEarly: true};
    }
    if (value.hour > 13) {
      return {tooLate: true};
    }
    return null;
  });

  ngOnInit() {
    this.editor = new Editor();
    this.color = '#0074ff';
  }
  
  ngOnDestroy() {
    this.editor.destroy();
  }
  
  ngAfterViewInit() {
  	// tagify
    var inputElement = document.querySelector('[data-render="tags"]');
    new Tagify(inputElement);
  }
  
  handleChange($event: ColorEvent) {
  	this.color = $event.color.hex;
  }
  
  code1 = `<!-- page.ts -->
import { Component, Injectable, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
  
@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    return (date && date.getFullYear) ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }
}

@Component({
  selector: 'page',
  templateUrl: './page.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})

export class YourPage {
  model1: Date;
}

<!-- page.html -->
<ngb-datepicker #d1 [(ngModel)]="model1" #c1="ngModel"></ngb-datepicker>
`;
  
  code2 = `<!-- page.ts -->
export class YourPage {
  time = {hour: 13, minute: 30};
  meridian = true;
}

<!-- page.html -->
<ngb-timepicker [(ngModel)]="time" [meridian]="meridian"></ngb-timepicker>`;
  
  code3 = `<!-- page.ts -->
import { Editor } from 'ngx-editor';

export class YourPage implements OnInit, OnDestroy {
  editor: Editor;
  html: '';
  
  ngOnInit() {
    this.editor = new Editor();
  }
  
  ngOnDestroy() {
    this.editor.destroy();
  }
}

<!-- page.html -->
<div class="NgxEditor__Wrapper border-0">
  <ngx-editor-menu [editor]="editor"> </ngx-editor-menu>
  <ngx-editor
    [editor]="editor"
    [ngModel]="html"
    [disabled]="false"
    [placeholder]="'Type here...'"
  ></ngx-editor>
</div>`;
  
  code4 = `<!-- page.ts -->
import Tagify from '@yaireo/tagify';

@Component({
  selector: 'page',
  templateUrl: './page.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './page.css' ]
})

export class YourPage {
  ngAfterViewInit() {
    var inputElement = document.querySelector('[data-render="tags"]');
    new Tagify(inputElement);
  }
}

<!-- page.css -->
@import "~@yaireo/tagify/dist/tagify.css";

<!-- page.html -->
<input data-render="tags" value='[{"value":"tag1"}, {"value":"tag2"}]' />`;
  
  code5 = `<!-- page.ts -->
import { ColorEvent } from 'ngx-color';

export class YourPage implements OnInit {
  color;
	
  handleChange($event: ColorEvent) {
    this.color = $event.color.hex;
  }
  
  ngOnInit() {
    this.color = '#0074ff';
  }
}
  
<!-- page.html -->
<div class="input-group" ngbDropdown placement="bottom-right">
  <div class="input-group-text px-2">
    <div class="w-20px h-20px rounded" [ngStyle]="{'background-color': this.color}"></div>
  </div>
  <input type="text" class="form-control" value="#00acac" [(ngModel)]="this.color" />
  <button class="btn btn-outline-inverse" ngbDropdownToggle><i class="fa fa-tint"></i></button>
  <div class="dropdown-menu dropdown-toggle w-250px" ngbDropdownMenu>
    <color-sketch color="#00acac" (onChange)="handleChange($event)"></color-sketch>
  </div>
</div>`;
}
