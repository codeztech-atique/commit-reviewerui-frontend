// toast.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ToastService {
    private toastSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor() {}
  
    getToast(): Observable<any> {
      return this.toastSubject.asObservable();
    }

    showToast(msg: string, icon: string, iconColor: string, animation: string): void {
        const toast = {
        msg,
        icon,
        iconColor,
        animation,
        };
        this.toastSubject.next(toast);
    }
}
