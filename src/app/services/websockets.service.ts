import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject, Observable, BehaviorSubject, pipe, mergeMap, last, timer, takeUntil } from "rxjs";
import { environment } from '../../environments/environment';
import { SharedservicesService }    from './sharedservices.service';
import { NotificationService }      from './notification.service';
import { CommonService }    from './common.service';
import { CONSTANTS } from '../config/constants';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public subject: WebSocketSubject<any>;

  receivedMessage: any;
  currentUser: any;
  params:any;
  fromPage: Number;
  pageSize: Number;
 
  constructor(private shared: SharedservicesService, private notificationService: NotificationService, private commonService: CommonService) {
    // For Notification
    this.getRequestIds();
  }

  public getRequestIds() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser) {
        this.shared.getRequestIds().subscribe({
            next: async(response) => {
              const responseData = JSON.parse(JSON.stringify(response));
              this.connect(responseData.result);
            },
            error: (error) => {
              console.log(error);
            }
        })
    }
  }

  public connect(requestId) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.subject = webSocket({
      url: environment.websocketUrlClient+"?userid="+this.currentUser['cognito:username'],
      deserializer: ({ data }) => {
        return new Promise((res, rej) => {
          res(data);
        });
      },
      openObserver: {
        next: () => {
          console.log('connecion ok');
          this.receivePrivateMessage();
          this.receiveNotificationMessage(); // comment later
          this.updateRoom(requestId);
        },
      },
      closeObserver: {
        next: () => {
          console.log('disconnect ok');
          this.getRequestIds();
        },
      },
    });
    this.subject.subscribe();
  }

  public updateRoom(requestId) {
    let updateRooms = {
      action: "update_rooms",
      message: {
        roomUpdated: true,
        body: {
          userId: this.currentUser["cognito:username"],
          userEmail:this.currentUser["email"],
          userName: this.currentUser["custom:name"],
          role: this.currentUser["custom:role"],
          requestids: requestId
        }
      }
    } 
    this.subject.next(updateRooms);
  }

  public send(msg) {
    console.log('Send Message:', msg);
    this.subject.next(msg);
  }

  public disconnect() {
    this.subject.complete();
  }

  // public receive() {
  //   return new Promise((resolve, reject) => {
  //     this.subject.subscribe(
  //       msg => {
  //         if(msg.__zone_symbol__value != "") {
  //           const data = JSON.parse(msg.__zone_symbol__value);
  //           console.log("message incoming:", data);
  //           if(data.sendRoomToAssignedPeople) { // When first Bussiness Analysts Added
  //             console.log('message received: ', data);
  //             resolve({
  //               status: true,
  //               ...data
  //             });
  //           }
  //         }
  //       }
  //     );
  //   })
  // }

  // public async receiveMessage() {
  //   if(this.subject) {
  //     this.receivedMessage = await this.receive();
  //     if(this.receivedMessage.status) {
  //       this.notificationService.success(this.receivedMessage.title, this.receivedMessage.body);
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  public receiveNotificationMessage() {
    console.log("I am notification message")
    if(this.subject) {
      this.subject.subscribe(
        msg => {
          if(msg.__zone_symbol__value != "") {
            const data = JSON.parse(msg.__zone_symbol__value);
            if(data.body && data.title) {
              console.log('message received: ', data);
              this.notificationService.success(data.title, data.body);
              // this.shared.listChatRequestIds();
            }
          }
        }
      );
    }
  }

  public receivePrivateMessage() {
    if(this.subject) {
      this.subject.subscribe(
        msg => {
          if(msg.__zone_symbol__value != "") {
            const data = JSON.parse(msg.__zone_symbol__value);
            if(data.messageType == 'private') {
              console.log("Private Received Message:", data);
              this.commonService.receivedPrivateMessage(data);
            } else if(data.messageType == "group") {
              console.log("Group Received Message:", data);
              this.commonService.receivedGroupMessage(data)
            }
          }
        }
      );
    }
  }
}
