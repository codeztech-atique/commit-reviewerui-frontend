import { Component } from '@angular/core';

@Component({
  selector: 'ui-review-work',
  templateUrl: './review-work.html'
})

export class Customer_ReviewWork {
	code1 = `<div class="alert alert-success alert-dismissible fade show">
  <strong>Success!</strong>
  This is a success alert with 
  <a href="#" class="alert-link">an example link</a>. 
  <button type="button" class="btn-close" data-bs-dismiss="alert"></span>
</div>	
`;

	code2 = `<div class="alert alert-primary fade show">...</div>
<div class="alert alert-secondary fade show">...</div>
<div class="alert alert-success fade show">...</div>
<div class="alert alert-danger fade show">...</div>
<div class="alert alert-warning fade show">...</div>
<div class="alert alert-yellow fade show">...</div>
<div class="alert alert-info fade show">...</div>
<div class="alert alert-lime fade show">...</div>
<div class="alert alert-purple fade show">...</div>
<div class="alert alert-light fade show">...</div>
<div class="alert alert-dark fade show">...</div>
<div class="alert alert-indigo fade show">...</div>
<div class="alert alert-pink fade show">...</div>
<div class="alert alert-green fade show">...</div>`;
	
	code3 = `<!-- default -->
<div class="note note-primary">
  <div class="note-icon"><i class="fab fa-facebook-f"></i></div>
  <div class="note-content">
    <h4><b>Note with icon!</b></h4>
    <p> ... </p>
  </div>
</div>

<!-- with end icon -->
<div class="note note-warning note-with-end-icon">
  <div class="note-icon">...</div>
  <div class="note-content text-end">
    ...
  </div>
</div>`;
	
	code4 = `<!-- badge -->
<span class="badge bg-primary">badge</span>

<!-- badge-pill -->
<span class="badge bg-danger rounded-pill">badge-pill</span>

<!-- badge-square -->
<span class="badge bg-inverse rounded-0">badge-square</span>`;

	code5 = `<!-- pagination -->
<div class="pagination">
  <div class="page-item disabled"><a href="#" class="page-link">«</a></div>
  <div class="page-item active"><a href="#" class="page-link">1</a></div>
  <div class="page-item"><a href="#" class="page-link">2</a></div>
  <div class="page-item"><a href="#" class="page-link">3</a></div>
  <div class="page-item"><a href="#" class="page-link">4</a></div>
  <div class="page-item"><a href="#" class="page-link">5</a></div>
  <div class="page-item"><a href="#" class="page-link">»</a></div>
</div>

<!-- pagination rounded -->
<div class="pagination">
  <div class="page-item me-auto">
    <a href="#" class="page-link rounded-pill px-3">Previous</a>
  </div>
  <div class="page-item">
    <a href="#" class="page-link rounded-pill px-3">Next</a>
  </div>
</div>`;
	
	code6 = `<!-- default -->
<div class="progress">
  <div class="progress-bar fs-10px fw-bold" style="width: 80%">Basic</div>
</div>

<!-- striped -->
<div class="progress progress-striped">
  <div class="progress-bar bg-warning" style="width: 80%">
    Striped
  </div>
</div>

<!-- animated -->
<div class="progress progress-striped active">
  ...
</div>

<!-- stacked -->
<div class="progress">
  <div class="progress-bar bg-dark" style="width: 25%">...</div>
  <div class="progress-bar bg-grey" style="width: 25%">...</div>
  <div class="progress-bar bg-lime" style="width: 25%">...</div>
</div>`;
}
