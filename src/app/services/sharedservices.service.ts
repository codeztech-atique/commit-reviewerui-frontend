import { BehaviorSubject, Observable } from 'rxjs';

import { AuthenticationService } from '../auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Userdetails } from '../models/user.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SharedservicesService {
  private currentUserSubject: BehaviorSubject<Userdetails>;
  public currentUser: Observable<Userdetails>;
  public currentUserLoggedIn = this.authenticationService.currentUserValue;

  public isUserLogin = this.currentUserLoggedIn !== null ? true : false;
  public headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

  public uri = environment.url;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.currentUserSubject = new BehaviorSubject<Userdetails>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Userdetails {
    return this.currentUserSubject.value;
  }

  // Get dashboard API
  public getDashboard() {
    return this.http.get(`${this.uri}/api/dashboard`);
  }

  
  // Quick Request
  public getListOfCommits() {
    return this.http.get(`${this.uri}/api/total-commits`);
  }

  public getListCommitDetails(id: string) {
    return this.http.get(`${this.uri}/api/details?commitid=`+id);
  }
  
}
