import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { Notification, NotificationType } from "../models/notification.model";

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  // public _subject = new BehaviorSubject<any>([]);
  public _subject = new Subject<Notification>();
  private _idx = 0;

  constructor() { }

  getObservable(): Observable<Notification> {
    return this._subject.asObservable();
  }

  info(title: string, message: string, timeout = 10000) { //1000000000
    this._subject.next(new Notification(this._idx++, NotificationType.info, title, message, timeout));
  }

  success(title: string, message: string, timeout = 10000) {
    console.log("Inside Notification Service:", title, message)
    this._subject.next(new Notification(this._idx++, NotificationType.success, title, message, timeout));
  }

  warning(title: string, message: string, timeout = 10000) {
    this._subject.next(new Notification(this._idx++, NotificationType.warning, title, message, timeout));
  }

  error(title: string, message: string, timeout = 10000) {
    this._subject.next(new Notification(this._idx++, NotificationType.error, title, message, timeout));
  }
}