
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChargebeeService {
  constructor(private http: HttpClient) {}
  public uri = environment.url;
  // public idToken: any = JSON.parse(localStorage.getItem('currentUser')).idToken;
  // public headers: any = new HttpHeaders({
  //   'Authorization': `Bearer ${this.idToken}`
  // });

  getAllPlans() {
    return this.http.get<any>(`${this.uri}/plans`);
  }

  updateChargeBeeSubscription(data) {
    return this.http.post<any>(`${this.uri}/subscription-update`, data);
  }

  updatePlans(data) {
    return this.http.post<any>(`${this.uri}/plan-update`, data);
  }

}
