// toast.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from '../../services/toast.service'; // Adjust the path based on your project structure
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: any;
  subscription: Subscription;

  constructor(private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.subscription = this.toastService.getToast().subscribe((toast) => {
       this.toast = toast;
  
        // Auto-hide the toast after 3 seconds
        if (this.toast) {
          setTimeout(() => {
            this.hideToast();
          }, 3000);
        }
      });
  }

  hideToast(): void {
    this.toast = null;
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
