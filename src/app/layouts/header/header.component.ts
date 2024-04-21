import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SharedservicesService }    from '../../services/sharedservices.service';
import { CommonService }    from '../../services/common.service';
import { IntroService } from '../../services/intro.service';
import { WebSocketService }  from '../../services/websockets.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Userdetails } from '../../models/user.model';
import appSettings from '../../config/app-settings';
import { CONSTANTS } from '../../config/constants';
import { debounceTime } from 'rxjs/operators';

@Component({
	selector: 'header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
	currentUser: Userdetails;
    currentUserSubscription: Subscription;
	public _subscription: Subscription;
	userCurrentPlan: any;
	userCurrentPlanExpires: boolean;
	unreadNotification: any;
	userProfilePictureURL: any;
	notificationData: any;
	timeAgo: any;
	logo: any;

	fromPage: number;
	pageSize: number;

	isVisited: boolean;
	openNotication: boolean
	
	@Input() appSidebarTwo;
	@Output() appSidebarEndToggled = new EventEmitter<boolean>();
	@Output() appSidebarMobileToggled = new EventEmitter<boolean>();
	@Output() appSidebarEndMobileToggled = new EventEmitter<boolean>();
	appSettings = appSettings;

	toggleAppSidebarMobile() {
		this.appSidebarMobileToggled.emit(true);
	}

	toggleAppSidebarEnd() {
		this.appSidebarEndToggled.emit(true);
	}

	toggleAppSidebarEndMobile() {
		this.appSidebarEndMobileToggled.emit(true);
	}

	toggleAppTopMenuMobile() {
		this.appSettings.appTopMenuMobileToggled = !this.appSettings.appTopMenuMobileToggled;
	}

	toggleAppHeaderMegaMenuMobile() {
		this.appSettings.appHeaderMegaMenuMobileToggled = !this.appSettings.appHeaderMegaMenuMobileToggled;
	}

	constructor(private route: ActivatedRoute, private router: Router, private introService: IntroService, private authenticationService: AuthenticationService, private wbsocketService: WebSocketService, private commonService: CommonService, private shared: SharedservicesService, private elementRef: ElementRef) {
		this.fromPage = CONSTANTS.PAGESTARTS_FROM;
		this.pageSize = CONSTANTS.NOTIFICATION_PAGESIZE;
		this.isVisited = false;
		this.openNotication = false;
		this.unreadNotification = 0;
		this.logo = "../../../assets/img/logo/apple-icon.png";
	
		this.currentUserSubscription = this.authenticationService.currentUser.subscribe(async user => {
			this.currentUser = user;
			this.userProfilePictureURL = this.currentUser['custom:profileurl'];

			// Get the subscription details
			if(this.currentUser['custom:selectedPlan'] === 'Freemium-USD-Daily') {
               	this.userCurrentPlan = `Trail`
			    const planExpires = this.currentUser['custom:sub_enddate'];
				const planExpiresDate = new Date(planExpires);
				const currentDate = new Date();
				if(planExpiresDate > currentDate) {
					this.userCurrentPlanExpires = false;
				} else {
					this.userCurrentPlanExpires = true;
				}
			} else if(this.currentUser['custom:selectedPlan'] === 'Base-Plan-Monthly') {
				this.userCurrentPlan = `Base`
			} else if(this.currentUser['custom:selectedPlan'] === 'Pro-Plan-Monthly') {
				this.userCurrentPlan = `Pro`
			} else { // This is enterprise account
				this.userCurrentPlan = `Enterprise`
			}

			setTimeout(() => {
				if(Object.keys(this.currentUser).length > 0) {
					this.callNoticationAPI();
				}
			}, 3000);

			if(Object.keys(this.currentUser).length > 0) {
				this._subscription = this.commonService._subjectCommon.asObservable().pipe(debounceTime(1000)).subscribe((notification) => {
					if(notification) {
						this.callNoticationAPI();
					}
				});
			}
		});
		
		this.commonService._subjectProfile$.subscribe((profilePicURL) => {
			const userDetails = JSON.parse(localStorage.getItem('currentUser'));
			userDetails['custom:profileurl'] = profilePicURL;
			localStorage.setItem('currentUser', JSON.stringify(userDetails))
			this.userProfilePictureURL = profilePicURL;
		});

		this.commonService.subjectSubscription$.subscribe((data) => {
			if(data && data['custom:selectedPlan'] === 'Freemium-USD-Daily') {
				this.userCurrentPlan = `Trail`
				const planExpires = data['custom:sub_enddate'];
				const planExpiresDate = new Date(planExpires);
				const currentDate = new Date();
				if(planExpiresDate > currentDate) {
					this.userCurrentPlanExpires = false;
				} else {
					this.userCurrentPlanExpires = true;
				}
			} else if(data && data['custom:selectedPlan'] === 'Base-Plan-Monthly') {
				this.userCurrentPlan = `Base`
			} else if(data && data['custom:selectedPlan'] === 'Pro-Plan-Monthly') {
				this.userCurrentPlan = `Pro`
			} else if(data && data['custom:selectedPlan'] === 'Enterprise-Plan-Monthly') { // This is enterprise account
				this.userCurrentPlan = `Enterprise`
			}
		});
	}

	@HostListener('document:click', ['$event'])
	onClickOutsideComponent(event: Event): void {
		const clickedInside = this.elementRef.nativeElement.contains(event.target);
		if (!clickedInside) {
			// The click occurred outside the component. Add your logic here.
			this.openNotication = false;
		} 
	}
    
	startTour() {
		this.router.navigate(['/dashboard']);

		// Start the intro
		this.introService.startIntro();
	}
    

	// Add the bussiness logic here.
	ngOnInit() {
		this._subscription = this.commonService._subjectCommon.subscribe((notification) => {
			if(notification) {
				this.callNoticationAPI();
			}
		});
	}

	ngOnDestroy() {
		this.appSettings.appTopMenuMobileToggled = false;
		this.appSettings.appHeaderMegaMenuMobileToggled = false;
		this._subscription.unsubscribe();
	}

	isVisited_Notification() {
	    if(this.openNotication) {
		  this.openNotication = false;
	    } else {
		  this.openNotication = false;
		}	
        this.isVisited = true;

		

		// Filter Unread notication - 
        const unreadNotification = this.notificationData.filter((notificationData => notificationData._source.status == "send"))
		
		// Made all the unread notification read
		this.notificationData = this.notificationData.map((notification) => {
			if(notification._source.status == 'send') { 
				notification._source.status = 'read'; 
			}
			return notification;
		})
		
		if(unreadNotification.length > 0) {
			let readMessage = {
				action: "read_notification_msg",
				message: {
					type: 'notification',
					body: unreadNotification
				}
			}
			this.wbsocketService.send(readMessage);
		}
	}

	viewMoreNotification() {
		this.pageSize += 5;
		this.isVisited = false;
		this.openNotication = false;
		this.callNoticationAPI();
	}

	callNoticationAPI() {
		this._subscription.unsubscribe();

		const data = {
			fromPage: this.fromPage,
			pageLimit: this.pageSize
		}
	
		this.shared.listNotification(data).subscribe({
			next: async(response) => {
				const responseData = JSON.parse(JSON.stringify(response));
				this.notificationData = responseData;
				this.unreadNotification = 0;
				for(let i = 0; i < this.notificationData.length; i++) {
					if(this.notificationData[i]._source.status === "send") {
						this.unreadNotification++;
					}
				}

				if(this.unreadNotification > 0) {
					this.isVisited = false;
				}
				console.log("Notication API Result:", this.notificationData);
			},
			error: (error) => {
				this.notificationData = [];
				console.log(error);
			}
		});
	}
	

	logout() {
		// First call logout API
		this.authenticationService.logoutAPICall().subscribe({
			next: (response) => {
			   this.authenticationService.logout();
			},
			error: (error) => {
			   console.log("Logout error:", error)
			}
		})
	}
}
