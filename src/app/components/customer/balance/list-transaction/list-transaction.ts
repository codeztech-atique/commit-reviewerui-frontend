import { Component } from '@angular/core';

@Component({
  selector: 'list-transaction',
  templateUrl: './list-transaction.html'
})

export class Customer_ListTransaction {
	code1 = `<div class="nav-wizards-container">
  <nav class="nav nav-wizards-1 mb-2">
    <!-- completed -->
    <div class="nav-item col">
      <a class="nav-link completed" href="#">
        <div class="nav-no">1</div>
        <div class="nav-text">Completed step</div>
      </a>
    </div>

    <!-- active -->
    <div class="nav-item col">
      <a class="nav-link active" href="#">
        <div class="nav-no">3</div>
        <div class="nav-text">Active step</div>
      </a>
    </div>

    <!-- disabled -->
    <div class="nav-item col">
      <a class="nav-link disabled" href="#">
        <div class="nav-no">5</div>
        <div class="nav-text">Last step</div>
      </a>
    </div>
  </nav>
</div>

<div class="card">
  <div class="card-body">
    wizard content here
  </div>
</div>
`;
	
	code2 = `<div class="nav-wizards-container">
  <nav class="nav nav-wizards-2 mb-3">
    <!-- completed -->
    <div class="nav-item col">
      <a class="nav-link completed" href="#">
        <div class="nav-text">1. Completed step text</div>
      </a>
    </div>

    <!-- active -->
    <div class="nav-item col">
      <a class="nav-link active" href="#">
        <div class="nav-text">2. Active step text</div>
      </a>
    </div>

    <!-- disabled -->
    <div class="nav-item col">
      <a class="nav-link disabled" href="#">
        <div class="nav-text">3. Disabled step text</div>
      </a>
    </div>
  </nav>
</div>

<div class="card">
  <div class="card-body">
    wizard content here
  </div>
</div>
`;
	
	code3 = `<div class="nav-wizards-container">
  <nav class="nav nav-wizards-3 mb-2">
    <!-- completed -->
    <div class="nav-item col">
      <a class="nav-link completed" href="#">
        <div class="nav-dot"></div>
        <div class="nav-no">Step 1</div>
        <div class="nav-text">Completed step</div>
      </a>
    </div>

    <!-- active -->
    <div class="nav-item col">
      <a class="nav-link active" href="#">
        <div class="nav-dot"></div>
        <div class="nav-no">Step 3</div>
        <div class="nav-text">Active step</div>
      </a>
    </div>

    <!-- disabled -->
    <div class="nav-item col">
      <a class="nav-link disabled" href="#">
        <div class="nav-dot"></div>
        <div class="nav-no">Step 5</div>
        <div class="nav-text">Last step</div>
      </a>
    </div>
  </nav>
</div>

<div class="card">
  <div class="card-body">
    wizard content here
  </div>
</div>
`;
}
