import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  // public _subject = new BehaviorSubject<any>([]);
  public _subjectCommon = new Subject<any>();
  public _subjectProfile$ = new Subject<any>();
  private _subjectSubscription$ = new Subject<any>();
  public _subjectReceivedPrivateMessage$ = new Subject<any>();
  public _subjectReceivedGroupMessage$ = new Subject<any>();
  public _subjectListChatRequestAPI$ = new Subject<any>();

  receivedMessage$ = this._subjectReceivedPrivateMessage$.asObservable();
  receivedGroupMessage$ = this._subjectReceivedGroupMessage$.asObservable();
  updatedProfile$ = this._subjectProfile$.asObservable();
  subjectSubscription$ :Observable<any> = this._subjectSubscription$.asObservable();

  
  constructor() { }

  getObservable(): Observable<any> {
    return this._subjectCommon.asObservable();
  }

  setProfilePicture(product: any) {
    this._subjectProfile$.next(product);
  }

  updateSubscriptionDetails(data: any) {
    this._subjectSubscription$.next(data);
  }

  receivedPrivateMessage(message: any) {
    this._subjectReceivedPrivateMessage$.next(message);
  }

  receivedGroupMessage(message: any) {
    this._subjectReceivedGroupMessage$.next(message);
  }

  listChatRequestsAPI(apiData: any) {
    this._subjectListChatRequestAPI$.next(apiData);
  }
}