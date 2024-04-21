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
    return this.http.get(`${this.uri}/user/dashboard`);
  }

  // Send verfication code, for verify email
  public sendVerificationCode(data) {
    return this.http.post(`${this.uri}/user/send-verification-code`, data);
  }

  // List all category
  public getAllCategory() {
    return this.http.get(`${this.uri}/user/list/all-category`);
  }

  // Single upload 
  public upload(file) {
    return this.http.post(`${this.uri}/user/upload`, file);
  }

  // Multipart upload
  public startUpload(file) {
    return this.http.post(`${this.uri}/user/start-upload`, file);
  }
  
  // Get Pre Sign URL
  public getPreSignURL(file) {
    return this.http.post(`${this.uri}/user/generate-url`, file);
  }
  
  // Complete Upload
  public completeUpload(file) {
    return this.http.post(`${this.uri}/user/complete-upload`, file);
  }

  // Delete file
  public deleteFile(data) {
    return this.http.post(`${this.uri}/user/file/delete`, data);
  }

  public submitRequest(data) {
    return this.http.post(`${this.uri}/user/submit-request`, data);
  }

  public getRequestIds() {
    return this.http.get(`${this.uri}/user/request-ids`);
  }

  // Quick Request
  public getlistUpload(data) {
    return this.http.post(`${this.uri}/user/list-upload`, data);
  }

  // Project Request
  public getlistUploads(data) {
    return this.http.post(`${this.uri}/user/list-uploads`, data);
  }

  public getlistIdentifyTask(data) {
    return this.http.post(`${this.uri}/user/list-identify-task`, data);
  }

  public getlistPendingTask(data) {
    return this.http.post(`${this.uri}/user/list-pending-task`, data);
  }

  public getlistOngoingTask(data) {
    return this.http.post(`${this.uri}/user/list-ongoing-task`, data);
  }

  public getlistOngoingTasks(data) {
    return this.http.post(`${this.uri}/user/list-ongoing-tasks`, data);
  }

  public getlistCompletedWork(data) {
    return this.http.post(`${this.uri}/user/list-complete-tasks`, data)
  }

  public getlistReviewWorkBy_BussinessAnalysts(data) {
    return this.http.post(`${this.uri}/user/list-review-tasks`, data)
  }

  public getAvailableDataAnalysts() {
    return this.http.get(`${this.uri}/user/available-data-analysts`);
  }

  public updateUserRequest(data) {
    return this.http.put(`${this.uri}/user/update-user-request`, data);
  }

  public listNotification(data) {
    return this.http.post(`${this.uri}/user/notifications`, data);
  }

  public taskDetails(taskId) {
    return this.http.get(`${this.uri}/user/task-details?taskid=`+taskId);
  }

  public acceptDeal(data) {
    return this.http.post(`${this.uri}/user/accept-deal`, data);
  }

  public fullFilledOrders(data) {
    return this.http.post(`${this.uri}/user/list-order-fulfilled`, data);
  }

  public listOpenOrders(data) {
    return this.http.post(`${this.uri}/user/list-open-orders`, data);
  }

  public listChatRequestIds() {
    return this.http.get(`${this.uri}/user/list-chat-request`);
  }

  public listChatAnalysts() {
    return this.http.get(`${this.uri}/user/list-chat-analysts`);
  }

  // get country
  public getCountryData() {
    return this.http.get(`${this.uri}/user/country`);
  }

  // Single upload 
  public uploadPicture(file) {
    return this.http.post(`${this.uri}/user/upload-profile-pic`, file);
  }

  // Update profile details
  public updateProfile(data) {
    return this.http.post(`${this.uri}/user/update`, data);
  }

  // Get personal chat history personal-chat-details
  public getPersonalChatHistory(data) {
    return this.http.post(`${this.uri}/user/personal-chat-history`, data);
  }

  // Get group chat history group-chat-details
  public getGroupChatHistory(data) {
    return this.http.post(`${this.uri}/user/group-chat-history`, data);
  }

  // Get Analysts24x7 bot response
  public getBotResponse(data) {
    return this.http.post(`${this.uri}/user/interaction`, data);
  }

  // Reject request by bussiness analysts when the customer request any order first time
  public rejectRequest(data) {
    return this.http.post(`${this.uri}/user/reject`, data);
  }

  // List Rejected request by Bussiness Analysts
  public getlistRejectedBy_BussinessAnalysts(data) {
    return this.http.post(`${this.uri}/user/list-rejected-task`, data)
  }

  // Reject Submitted work.
  public rejectWork(data) {
    return this.http.post(`${this.uri}/user/reject-work`, data);
  }
 
}
