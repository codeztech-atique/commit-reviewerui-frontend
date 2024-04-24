import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SharedservicesService }    from '../../services/sharedservices.service';
import { CommonService }    from '../../services/common.service';
import { IntroService } from '../../services/intro.service';
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

	public _subscription: Subscription;
	userDetails: any;
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

	constructor(private route: ActivatedRoute, private router: Router, private introService: IntroService, private authenticationService: AuthenticationService, private commonService: CommonService, private shared: SharedservicesService, private elementRef: ElementRef) {
		this.fromPage = CONSTANTS.PAGESTARTS_FROM;
		this.pageSize = CONSTANTS.NOTIFICATION_PAGESIZE;
		this.isVisited = false;
		this.openNotication = false;
		this.unreadNotification = 0;
        this.userDetails = JSON.parse(localStorage.getItem('currentUser'));
		this.logo = "../../../assets/img/logo/apple-icon.png";

		this.userProfilePictureURL = this.userDetails && this.userDetails['custom:profile'] ? this.userDetails['custom:profile'] : '' ;
	
		
		this.commonService._subjectProfile$.subscribe((profilePicURL) => {
			
			// userDetails['custom:profileurl'] = profilePicURL;
			this.userProfilePictureURL = this.userDetails['custom:profile'] ? this.userDetails['custom:profile'] : '' ;
			localStorage.setItem('currentUser', JSON.stringify(this.userDetails))
			
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
		this.authenticationService.logout();
		// First call logout API
		// this.authenticationService.logoutAPICall().subscribe({
		// 	next: (response) => {
		// 	   this.authenticationService.logout();
		// 	},
		// 	error: (error) => {
		// 	   console.log("Logout error:", error)
		// 	}
		// })
	}
}
