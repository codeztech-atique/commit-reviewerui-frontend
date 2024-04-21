import { Component } from '@angular/core';

@Component({
  selector: 'create-issue',
  templateUrl: './create-issue.html'
})

export class Customer_CreateIssue {
	code1 = `<table class="table">
  ...
</table>`;
	
	code2 = `<table class="table table-hover">
  ...
</table>`;
	
	code3 = `<table class="table table-sm">
  ...
</table>`;
	
	code4 = `<div class="table-responsive">
  <table class="table">
    ...
  </table>
</div>
`;
	
	code5 = `<table class="table table-striped">
  ...
</table>`;
	
	code6 = `<table class="table table-bordered">
  ...
</table>`;
	
	code7 = `<table class="table align-middle">
  ...
</table>`;
	
	code8 = `<table class="table align-middle">
  <tbody>
    <tr>
      <!-- with input -->
      <td>
        <input type="text" class="form-control my-n1" />
      </td>
    </tr>
    
    <tr>
      <!-- with input-group -->
      <td>
        <div class="input-group my-n1"></div>
      </td>
    </tr>
    
    <tr>
      <!-- with btn-group -->
      <td>
        <div class="btn-group my-n1"></div>
      </td>
    </tr>
  </tbody>
</table>`;
	
	code9 = `<table class="table">
  <tbody>
    <tr class="table-active">...</tr>
    <tr class="table-info">...</tr>
    <tr class="table-success">...</tr>
    <tr class="table-warning">...</tr>
    <tr class="table-danger">...</tr>
  </tbody>
</table>`;
}

