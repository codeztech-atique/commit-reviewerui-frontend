import { Component, OnDestroy, ViewEncapsulation,ViewChild, ElementRef, OnInit } from '@angular/core';
import { CONSTANTS } from '../../config/constants';
import { SharedservicesService }  from '../../services/sharedservices.service';
import { CommonService }    from '../../services/common.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/authentication.service';
import appSettings from '../../config/app-settings';
import Swal from 'sweetalert2';
import 'lity';

@Component({
	selector: 'edit-profile',
	templateUrl: './edit-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./edit-profile.component.scss'],
	host: {
    '(document:click)': 'closeDropdownOnclickOutside($event)',
  }
})

export class EditProfile implements OnDestroy,OnInit {
	appSettings = appSettings;
	showEmojiIcon: any;
	userInfo: any;
	userName: any;
	userProfilePictureName: any;
	userProfilePictureURL: any;
	userMobileNo: any;
	userHomeNo: any;
	userOfficeNo: any;
	userAboutMe: any;
	listUserCountry: any;
	listCountry: any;
	listUserState: any;
	listUserCity: any;
	keepPreviousCountryRecord: any; 
	userCountry: any;
	userCountryFlag: any;
	userState: any;
	userCity: any;
  userBirthdate: any;
	userBirthdateDay: any;
	userBirthdateMonth: any;
	userBirthdateYear: any;

	// Define boolean variable
	showEmoji: boolean;
	showMobileNumber: boolean;
	showHomeNumber: boolean;
	showOfficeNumber: boolean;
	showAboutMe: boolean;
	showCountry: boolean;
	showState: boolean;
	flag: boolean;
	currentTab:String= 'about';
	newPasswordValue : string = '';
	confirmPasswordValue : string = '';
	newPasswordLengthError = false;
	PasswordMatchError = false;

	constructor(private shared: SharedservicesService, private auth: AuthenticationService, private commonService: CommonService, private router: Router) {
		this.appSettings.appContentClass = 'p-0';
		this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
		this.userProfilePictureURL = this.userInfo['custom:profileurl'];
		this.userProfilePictureName = this.userInfo['custom:profileurl'];
		
		if(this.userInfo['custom:name']) {
			this.userName = this.userInfo['custom:name'];
		}

		if(this.userInfo['custom:mood']) {
			this.showEmojiIcon = this.userInfo['custom:mood'];
		}

		if(this.userInfo['custom:mobile']) {
			this.userMobileNo = this.userInfo['custom:mobile'];
			this.showMobileNumber = false;
		}

		if(this.userInfo['custom:home']) {
			this.userHomeNo = this.userInfo['custom:home'];
			this.showHomeNumber = false;
		}

		if(this.userInfo['custom:office']) {
			this.userOfficeNo = this.userInfo['custom:office'];
			this.showOfficeNumber = false;
		}

		if(this.userInfo['custom:description']) {
			this.userAboutMe = this.userInfo['custom:description'];
			this.showAboutMe = false;
		}

		if(this.userInfo['custom:country']) {
			this.userCountry = this.userInfo['custom:country'];
		}

		if(this.userInfo['custom:state']) {
			this.userState = this.userInfo['custom:state'];
		}

		if(this.userInfo['custom:city']) {
			this.userCity = this.userInfo['custom:city'];
		}

		if(this.userInfo['custom:birthdate']) {
			this.userBirthdate = this.userInfo['custom:birthdate'];
			const userBirthDate = this.userBirthdate.split('/')
			this.userBirthdateDay = userBirthDate[0];
			this.userBirthdateMonth = userBirthDate[1];
			this.userBirthdateYear = userBirthDate[2];
		}

		this.showCountry = false;
		this.flag = false;
		this.keepPreviousCountryRecord = "";

		this.userProfilePictureName = this.userProfilePictureName.split('/').pop();

		this.shared.getCountryData().subscribe({
			next: async(response) => {
			  const responseData = JSON.parse(JSON.stringify(response));
			  this.listUserCountry = responseData;
			  this.listCountry = responseData;
			  this.listUserCountry.filter((country) => {
				if(country.name.toLowerCase() == this.userCountry.toLowerCase()) {
					this.userCountry = country.name;
					this.userCountryFlag = country.emoji;
					this.listUserState = country.states;
				}
			  })
			},
			error: (error) => {
			  console.log(error);
			}
		});
	}

	ngOnInit(): void {}

	ngOnDestroy() {
		this.appSettings.appContentClass = '';
	}

	selectMood() {
		if(this.showEmoji) {
			this.showEmoji = false;
		} else {
			this.showEmoji = true;
		}
	}

	addEmoji(event) {
	   this.showEmoji = false;	
       this.showEmojiIcon = event.emoji.native;
	}

	selectProfilePicture() {
		const sharedservices = this.shared;
		// const sendUserProfilePic = this.sendUserProfilePic(null);
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
			  confirmButton: 'btn btn-success btn-width-5',
			  cancelButton: 'btn btn-white btn-width-5 mr-left-5'
			},
			buttonsStyling: false
		});


		swalWithBootstrapButtons.fire({
			title: 'Select image',
			input: 'file',
			inputAttributes: {
				'accept': 'image/*',
				'aria-label': 'Upload your profile picture'
			},
			showConfirmButton: true,
			showCancelButton: true,
			allowOutsideClick: false,
			cancelButtonText: 'Cancel'
		}).then((res) => {
			var that = this;
			if(res.value) {
                // File size should be less than 1 MB always
				console.log(res.value.size)

				if(res.value.size > CONSTANTS.MAX_PROFILE_PIC_UPLOAD_SIZE) {
					swalWithBootstrapButtons.fire({
						title: 'Upload failed !',
						text: 'Maximum file size <= 1 MB',
						icon: 'error',
						showConfirmButton: false,
						showCancelButton: true,
						allowOutsideClick: false,
						cancelButtonText: 'Cancel'
					})
				} else {
					var reader  = new FileReader();
					reader.onload = function(e) {
						swalWithBootstrapButtons.fire({
							title: 'Your uploaded picture',
							imageUrl: e.target.result+"",
							imageHeight: 300, 
							imageWidth: 300,   
							showConfirmButton: true,
							showCancelButton: true,
							allowOutsideClick: false,
							cancelButtonText: 'Cancel'
						}).then((res2) => {
							if(res2.isConfirmed) {
								
								const formData: FormData = new FormData();
								formData.append('file', res.value);
								formData.append('location', "profile-picture");
	
								swalWithBootstrapButtons.fire({
									title: "Uploading Image",
									imageUrl: "../../../assets/img/extra/loading.gif",
									imageWidth: 80,
									text: 'Please wait',
									showConfirmButton: false,
									showCancelButton: false,
									
									allowOutsideClick: false,
								})
	
								// Call API
								sharedservices.uploadPicture(formData).subscribe({
									next: (response) => {
										const result = JSON.parse(JSON.stringify(response));
										if (result.status === 200) {
											const userProfilePicName = result.fileLocation.split('/').pop();
											that.userProfilePictureURL = result.fileLocation;
											that.userProfilePictureName = userProfilePicName;
											swalWithBootstrapButtons.fire(
												'Success!',
												'Your profile pic has been successfully uploaded.',
												'success'
											);
											that.userInfo['custom:profileurl'] = that.userProfilePictureURL;
											localStorage.setItem('currentUser', JSON.stringify(that.userInfo));
											that.commonService.setProfilePicture(that.userProfilePictureURL);
										} else {
											swalWithBootstrapButtons.fire({
												title: 'Error !',
												text: 'Upload failed',
												icon: 'error',
												showConfirmButton: false,
												showCancelButton: true,
												allowOutsideClick: false,
												cancelButtonText: 'Cancel'
											});
										}
									},
									error: (error) => {
										console.log(error);
										swalWithBootstrapButtons.fire({
											title: 'Error !',
											text: 'Upload failed',
											icon: 'error',
											showConfirmButton: false,
											showCancelButton: true,
											allowOutsideClick: false,
											cancelButtonText: 'Cancel'
										})
									}
								});
							}
						})
					}
					reader.readAsDataURL(res.value);
				}
			}
			
			// const reader = new FileReader();
			// reader.readAsDataURL(res.value)
			// reader.onload =function () {
				
			// 	console.log("Target Result:", e.target.result);
			// }
			
		});

		// if (file) {
		// 	const reader = new FileReader()
		// 	reader.onload = (e) => {
		// 		swalWithBootstrapButtons.fire({
		// 			title: 'Your uploaded picture',
		// 			imageUrl: e.target.result,
		// 			imageAlt: 'The uploaded picture'
		// 	  });
		// 	}
		// 	reader.readAsDataURL(file)
		// }
	}

	addMobileNumber() {
		if(this.showMobileNumber) {
			this.showMobileNumber = false;
		} else {
			this.showMobileNumber = true;
		}
	}

	addHomeNumber() {
		if(this.showHomeNumber) {
			this.showHomeNumber = false;
		} else {
			this.showHomeNumber = true;
		}
	}

	addOfficeNumber() {
		if(this.showOfficeNumber) {
			this.showOfficeNumber = false;
		} else {
			this.showOfficeNumber = true;
		}
	}

	addAboutMe() {
		if(this.showAboutMe) {
			this.showAboutMe = false;
		} else {
			this.showAboutMe = true;
		}
	}

	onChangeUserBio(data) {
	   this.userAboutMe = data;
	}

	onChangeCityName(data) {
		this.userCity = data;
	}

	showDropDownCountry() {
		if(!this.flag) {
			if(this.showCountry) {
				this.showCountry = false;
			} else {
				this.showCountry = true;
			}
		}
	}

	showDropDownState() {
      if(this.showState) {
		this.showState = false;
	  } else {
		this.showState = true;
	  }
	}

	keepOpenDropDownCountry() {
		this.showCountry = true;
		this.flag = true;
	}

	searchCountryName(countryName) {
		if(this.keepPreviousCountryRecord.length < countryName.length) {
			this.keepPreviousCountryRecord = countryName;
		} else {
			this.listUserCountry = this.listCountry;
		}
		this.listUserCountry = this.listUserCountry.filter((data) => { 
			data.name = data.name.toLowerCase();
			countryName = countryName.toLowerCase();
			return data.name.includes(countryName)
		});
		if(countryName == "") {
			this.listUserCountry = this.listCountry;
		}
	}

	chooseCountry(country) {
		this.userCountry = country.name;
		if(country.states.length == 0) {
			this.userState = "Others";
		} else {
			this.userState = "";
		}
		country.states.push(
			{
                "name": "Others",
                "type": null
            }
		);
		this.listUserState = country.states;
		this.userCountryFlag = country.emoji;
		this.flag = false;
		this.listUserCountry = this.listCountry;
	}

	onChangeBirthday(data) {
		if(data < 1) {
			this.userBirthdateDay = 1;
		} else if(data >= 31) {
			this.userBirthdateDay = 31;
		} else {
			this.userBirthdateDay = data;
		}
	}

	onChangeBirthMonth(data) {
		if(data < 1) {
			this.userBirthdateMonth = 1;
		} else if(data >= 12) {
			this.userBirthdateMonth = 12;
		} else {
			this.userBirthdateMonth = data;
		}
	}

	onChangeBirthYear(data) {
		if(data < 1) {
			this.userBirthdateYear = 1940;
		} else if(data < 1940) {
			this.userBirthdateYear = 1940;
		} else {
			this.userBirthdateYear = data;
		}
	}

	chooseState(state) {
		this.userState = state.name;
	}

	confirmSubmit() {
		const swalWithBootstrapButtons = Swal.mixin({
		  customClass: {
			confirmButton: 'btn btn-success btn-width-5',
			cancelButton: 'btn btn-white btn-width-5 mr-left-5'
		  },
		  buttonsStyling: false
		});
  
		swalWithBootstrapButtons.fire({
		  title: 'Are you sure ?',
		  text: 'You wanted to update the details',
		  icon: 'warning',
		  showConfirmButton: true,
		  showCancelButton: true,
		  allowOutsideClick: false,
		  cancelButtonText: 'Cancel'
		}).then((res) => {
		    if(res.value) {
				swalWithBootstrapButtons.fire({
					title: "Updating Details",
					imageUrl: "../../../assets/img/extra/loading.gif",
					imageWidth: 80,
					text: 'Please wait',
					showConfirmButton: false,
					showCancelButton: false,
					allowOutsideClick: false,
				});
				this.updateProfile();
		  	}
		})
	}

	updateProfile() {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
			  confirmButton: 'btn btn-success btn-width-5',
			  cancelButton: 'btn btn-white btn-width-5 mr-left-5'
			},
			buttonsStyling: false
		});

		if(this.userBirthdateDay && this.userBirthdateMonth && this.userBirthdateYear) {
			this.userBirthdate = this.userBirthdateDay+"/"+this.userBirthdateMonth+"/"+this.userBirthdateYear;
		} else {
			this.userBirthdate = null;
		}

		const language = "English";
		const data = {
			name: this.userName,
			mood: this.showEmojiIcon ? this.showEmojiIcon : "😊",
			description: this.userAboutMe ? this.userAboutMe : null,
			mobile: this.userMobileNo ? this.userMobileNo.toString() : null,
			home: this.userHomeNo ? this.userHomeNo.toString() : null,
			office: this.userOfficeNo ? this.userOfficeNo.toString() : null,
			country: this.userCountry ? this.userCountry : null,
			state: this.userState ? this.userState : null,
			city: this.userCity ? this.userCity : null,
			dob: this.userBirthdate ? this.userBirthdate : null, 
			language: language
		}

		this.shared.updateProfile(data).subscribe({
			next: async(response) => {
			  const responseData = JSON.parse(JSON.stringify(response));
              
			  
              this.userInfo['custom:profileurl'] = this.userProfilePictureURL ? this.userProfilePictureURL : this.userInfo['custom:profileurl'];
			  this.userInfo['custom:name'] = this.userName ?  this.userName : this.userInfo['custom:name'];
			  this.userInfo['custom:mood'] = this.showEmojiIcon ?  this.showEmojiIcon : this.userInfo['custom:mood'];
			  this.userInfo['custom:description'] = this.userAboutMe ? this.userAboutMe : this.userInfo['custom:description'];
			  this.userInfo['custom:mobile'] = this.userMobileNo ? this.userMobileNo.toString() : this.userInfo['custom:mobile'];
			  this.userInfo['custom:home'] = this.userHomeNo ? this.userHomeNo.toString() : this.userInfo['custom:home'];
			  this.userInfo['custom:office'] = this.userOfficeNo ? this.userOfficeNo.toString() : this.userInfo['custom:office'];
			  this.userInfo['custom:country'] = this.userCountry ? this.userCountry : this.userInfo['custom:country'];
			  this.userInfo['custom:state'] = this.userState ? this.userState : this.userInfo['custom:state'];
			  this.userInfo['custom:city'] = this.userCity ? this.userCity : this.userInfo['custom:city'];
			  this.userInfo['custom:birthdate'] = this.userBirthdate ? this.userBirthdate : this.userInfo['custom:birthdate'];
			  this.userInfo['custom:language'] = language ? language : this.userInfo['custom:language'];

			  localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
			 
			  swalWithBootstrapButtons.fire(
				'Success!',
				'Your details successfully updated.',
				'success'
			  )

			  this.router.navigate([`/dashboard`]);
			},
			error: (error) => {
				console.log(error);
				swalWithBootstrapButtons.fire({
					title: 'Error !',
					text: 'Update failed',
					icon: 'error',
					showConfirmButton: false,
					showCancelButton: true,
					allowOutsideClick: false,
					cancelButtonText: 'Cancel'
				})
			}
		});
	}

	cancelUpdate() {
		this.router.navigate([`/dashboard`]);
	}

	@ViewChild('selectStateElement') selectStateElement: ElementRef;
	@ViewChild('selectCountryElement') selectCountryElement: ElementRef;
	
	closeDropdownOnclickOutside(event: MouseEvent) {
    if (!this.selectCountryElement?.nativeElement.contains(event.target as Node)) {
      this.showCountry = false;
    }

    if (!this.selectStateElement?.nativeElement.contains(event.target as Node)) {
      this.showState = false;
    }
  }

	changeTab(tab:string){
		this.currentTab=tab;
	}

	// Change Password functionality starts here

	varifyNewAndConfirmPass(field:string, value:string){
		this[field] = value;
		if(this.newPasswordValue.length < 6){
			this.newPasswordLengthError = true;
			this.PasswordMatchError = false;
		} else if(this.newPasswordValue !== this.confirmPasswordValue ){
			this.PasswordMatchError = true;
			this.newPasswordLengthError = false;
		} else {
			this.newPasswordLengthError = false;
			this.PasswordMatchError = false;
		}
	}

	showPassword :any = {
		newPassword : false,
		reenterPassword : false
	}

	togglePasswordVisibility(fieldName: string): void {
      this.showPassword[fieldName] = !this.showPassword[fieldName]
  }

	changePasswordSubmit() {
		if(!this.newPasswordLengthError && !this.PasswordMatchError ){
			const swalWithBootstrapButtons = Swal.mixin({
				customClass: {
				confirmButton: 'btn btn-success btn-width-5',
				cancelButton: 'btn btn-white btn-width-5 mr-left-5'
				},
				buttonsStyling: false
			});
		
			swalWithBootstrapButtons.fire({
				title: 'Are you sure ?',
				text: 'You wanted to change the password',
				icon: 'warning',
				showConfirmButton: true,
				showCancelButton: true,
				allowOutsideClick: false,
				cancelButtonText: 'Cancel'
			}).then( 
				()=>{
					swalWithBootstrapButtons.fire({
						title: 'Password has ben updated successfully',
						// text: 'You wanted to update the details',
						icon: 'success',
						showConfirmButton: true,
						// showCancelButton: true,
						allowOutsideClick: false,
						cancelButtonText: 'Cancel'
					})

					this.updatePassword();
				}
			)
		}
  }
  updatePassword() {
	const data = {
		email: this.userInfo['email'],
		password: this.newPasswordValue,
		newpassword: this.confirmPasswordValue
	}
	this.auth.changePassword(data)
      // .pipe(first())
      .subscribe({
        error: (e) => {
          console.log("Error is password update !!!")
        },
        complete: () => {
          console.log("Password successfully changed !!!")
		  this.router.navigate(['/dashboard']);
        }
    })
  }

}