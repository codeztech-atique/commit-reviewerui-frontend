
import { Component, OnInit, ViewChild, ElementRef, OnDestroy }          from '@angular/core';
import { Router }                                       from "@angular/router";
import { 
  customStepsQuickRequest, 
  customStepsProjectRequest, 
  approximateTimeLine,
  doYouHaveFile,
  whatYouWantedToUpload
}                                                       from '../../../../data/data';
import { CONSTANTS }                                    from '../../../../config/constants';
import { CommonService }                                from '../../../../services/common.service';
import { formatBytes, getFileExtension }                                  from '../../../../utils/index';
import { SharedservicesService }                        from '../../../../services/sharedservices.service';
import { WebSocketService }                             from '../../../../services/websockets.service';
import { NotificationService }                          from '../../../../services/notification.service';
import { AuthenticationService } from '../../../../auth/authentication.service';
import { Subscription } from 'rxjs';
import { Userdetails } from '../../../../models/user.model';
import { ToastService } from '../../../../services/toast.service'; 

import Swal from 'sweetalert2';
import * as uuid from 'uuid';
@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.scss'],
  host: {
    '(document:click)': 'closeDropdownOnclickOutside($event)',
  }
})

export class Customer_FileUpload implements OnInit, OnDestroy {
    currentUser: Userdetails;
    currentUserSubscription: Subscription;
    upcomingUserSubscription: Subscription;

    categoryList: any;
    selectedCategoryId: any;
    selectedCategoryName: any;
    selectedCategoryIcon: any;

    timeLineList: any;
    selectedTimeline: any;
    selectedTimelineInHrs: any;
    selectedFilePresent: any;

    doYouHaveAfile: any;
    wantedToUpload: any;
    orderCustomLinks: any;

    fileInfo: any = new FormData();
    fileInfoLength = 0;

    
    isFileProvidedByCustomer: boolean;
    isCustomFileProvided: boolean;
    fileUploadButtonStatus: boolean;
    fileDeleteButtonStatus: boolean;
    isFileUploaded: boolean;

    disabled_start_file_0: boolean;
    disabled_start_file_1: boolean;
    disabled_start_file_2: boolean;

    disabled_delete_file_0: boolean;
    disabled_delete_file_1: boolean;
    disabled_delete_file_2: boolean;

    showCategory: boolean;
    showTimeline: boolean;
    showOrderHasFile: boolean;
    showCustomFileLinks: boolean;
    showLoader: boolean;
    showDropdown: boolean;

    existingFileNames: Array<any> = [];
    customerUploadedLinks: Array<any> = [];
    customLink_1: any;
    customLink_2: any;
    customLink_3: any;
    customLink_4: any;
    customLink_5: any;
    customLink_Error_1: any;
    customLink_Error_2: any;
    customLink_Error_3: any;
    customLink_Error_4: any;
    customLink_Error_5: any;
    customSteps: any;
    currentStatus: any;
    customError: any;
    acceptFile: any;
    supportFile: any;
    index: any;
    pecentage_0: any;
    pecentage_1: any;
    pecentage_2: any;
    urlValidator: any;
    workDetails: any;
    isEnabledSubmit: boolean;
    fileUploadLocationId: any;
    confirmButtonText: any;
    updatedFileName: any;
    currentPlan: any;

    userCurrentPlan : any;
	  userCurrentPlanExpires: boolean;
    
    
    constructor(private commonService : CommonService, private toastService: ToastService, private wbsocketService: WebSocketService, protected notificationService: NotificationService, private router: Router, private shared: SharedservicesService,  private authenticationService: AuthenticationService ) {
      this.customSteps = customStepsQuickRequest;
      this.currentStatus = this.customSteps[0];
      this.fileUploadButtonStatus = true;
      this.fileDeleteButtonStatus = true;
      this.isEnabledSubmit = true;
      this.isFileUploaded = false;
      this.acceptFile = CONSTANTS.ACCEPT_FILE;
      this.supportFile = CONSTANTS.FILE_TYPE_SUPPORT;
      this.pecentage_0 = 0;
      this.pecentage_1 = 0;
      this.pecentage_2 = 0; 

      this.disabled_start_file_0 = false;
      this.disabled_start_file_1 = false;
      this.disabled_start_file_2 = false;
      
      this.disabled_delete_file_0 = false;
      this.disabled_delete_file_1 = false;
      this.disabled_delete_file_2 = false;

      this.showCategory = false;
      this.showTimeline = false;
      this.showOrderHasFile = false;
      this.showCustomFileLinks = false;
      this.showLoader = false;

      // Validating all kind of URL, http and https
      this.urlValidator = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
      
      this.customLink_Error_1 = null;
      this.customLink_Error_2 = null;
      this.customLink_Error_3 = null;
      this.customLink_Error_4 = null;
      this.customLink_Error_5 = null;

      // Get the current user details
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
          this.currentUser = user;
   
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
            } else if(this.currentUser['custom:selectedPlan'] === 'Enterprise-Plan-Monthly') { // This is enterprise account
                this.userCurrentPlan = `Enterprise`
            }
      });

      this.currentPlan = this.currentUser['custom:selectedPlan'];

      if(
        this.currentUser['custom:selectedPlan'] == 'Freemium-USD-Daily' || 
        this.currentUser['custom:selectedPlan'] == 'Base-Plan-Monthly' ||
        this.currentUser['custom:selectedPlan'] == 'Pro-Plan-Monthly'
      ) {
        this.customSteps = customStepsQuickRequest;
        this.selectedTimeline = approximateTimeLine[0].selectedTimeline;
        this.selectedTimelineInHrs = approximateTimeLine[0].selectedTimelineInHrs;
        this.showDropdown = false;
      } else if(this.currentUser['custom:selectedPlan'] === 'Enterprise-Plan-Monthly') {
        this.customSteps = customStepsQuickRequest;
        this.selectedTimeline = approximateTimeLine[0].selectedTimeline;
        this.selectedTimelineInHrs = approximateTimeLine[0].selectedTimelineInHrs;
        this.showDropdown = true;
      }

      //this.upcomingUserSubscription = 
      this.commonService.subjectSubscription$.subscribe((data) => {
        const res = JSON.parse(JSON.stringify(data));
        this.handleUpdatedValues(res);
      });

      this.fileUploadLocationId = uuid.v4();

      this.timeLineList = approximateTimeLine;
      this.doYouHaveAfile = doYouHaveFile;
      this.wantedToUpload = whatYouWantedToUpload;
      this.orderCustomLinks = this.wantedToUpload[0];
      this.confirmButtonText = "Submit";
      this.getAllCategory();
    }

    handleUpdatedValues(res) {
      this.currentPlan = res['custom:selectedPlan'];
        
      // Get the subscription details
      if(res['custom:selectedPlan'] === 'Base-Plan-Monthly') {
          this.userCurrentPlan = `Base`;
      } else if(res['custom:selectedPlan'] === 'Pro-Plan-Monthly') {
          this.userCurrentPlan = `Pro`;
      } else { // This is enterprise account
          this.userCurrentPlan = `Enterprise`
      }

      const planExpires = res['custom:sub_enddate'];
      const planExpiresDate = new Date(planExpires);
      const currentDate = new Date();
      if(planExpiresDate > currentDate) {
        this.userCurrentPlanExpires = false;
      } else {
        this.userCurrentPlanExpires = true;
      }
    }

    ngOnInit(): void {
      // this.socketService.setupSocketConnection();
      
    }

    getAllCategory() {
      this.shared.getAllCategory().subscribe({
        next: async(response) => {
          const responseData = JSON.parse(JSON.stringify(response));
          this.categoryList = responseData;
        },
        error: (error) => {
          console.log("Error:", error);
        }
    })
    }

    chooseCategory(index) {
      this.selectedCategoryId = index.id;
      this.selectedCategoryName = index.categoryName;
      this.selectedCategoryIcon = index.iconType;
    }

    chooseTimeline(index, data) {
      if(index === 0) { // Quick request
        this.customSteps = customStepsQuickRequest;
      } else { // Project request
        this.customSteps = customStepsProjectRequest;
      }
      this.selectedTimeline = data.selectedTimeline;
      this.selectedTimelineInHrs = data.selectedTimelineInHrs;
      // customStepsQuickRequest
    }

    onChangeCustomerChoices(e, haveFile) {
      this.selectedFilePresent = haveFile;
      if(e === 0) {
          this.isFileProvidedByCustomer = true;
          this.isCustomFileProvided = true;
      } 
      else if(e === 1) {
        this.isFileProvidedByCustomer = false;
        this.isCustomFileProvided = false;
        this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
      }
    }

    showDropDownCategory() {
      if(this.showCategory) {
        this.showCategory = false;
      } else {
        this.showCategory = true;
      }
    }

    showApproximateTimeline() {
      if(this.showTimeline) {
        this.showTimeline = false;
      } else {
        this.showTimeline = true;
      }
    }

    showCustomerHasFile() {
      if(this.showOrderHasFile) {
        this.showOrderHasFile = false;
      } else {
        this.showOrderHasFile = true;
      }
    }

    showOrderCustomFileLinks() {
      if(this.showCustomFileLinks) {
        this.showCustomFileLinks = false;
      } else {
        this.showCustomFileLinks = true;
      }
    }

    onChangeCustomerChoices_FileMode(e, data) {
      this.orderCustomLinks = data;
      if(e === 0) {
        this.isCustomFileProvided = true;
      } else {
        this.isCustomFileProvided = false;
      }
    }
   
    getFileDetails(event: FileList): void {
      // Get total file size
      let totalFileAllowed = event.length + this.fileInfoLength;
      let size = 0;
  
      // Incoming file size
      for (let i = 0; i < event.length; i++) {
          size += event[i].size;
      }
  
      // Present file size
      for (const file of this.fileInfo.entries()) {
          size += file[1].size;
      }
  
      // Check for duplicate file names
      const existingFile = Array.from(event).map(file => file.name)[0];
      if(this.existingFileNames.indexOf(existingFile) > -1) {
        this.customError = CONSTANTS.DUPLICATE_FILES;
        this.fileUploadButtonStatus = false;
        this.fileDeleteButtonStatus = false;
        return;
      } else {
        this.existingFileNames.push(existingFile)
      }
      
      if (totalFileAllowed > CONSTANTS.MAX_FILE) {
          this.customError = CONSTANTS.MAX_FILES_MESSAGE;
      } else if (size > CONSTANTS.MAX_FILES_SIZE) {
          if (totalFileAllowed > CONSTANTS.MAX_FILE) {
              this.customError = CONSTANTS.MAX_FILES_MESSAGE;
              this.fileUploadButtonStatus = true;
              this.fileDeleteButtonStatus = false;
          } else {
              this.customError = CONSTANTS.MAX_FILES_SIZE_MESSAGE;
              this.fileUploadButtonStatus = true;
              this.fileDeleteButtonStatus = false;
          }
      } else {
          // Store all the file into Array for iteration
          this.customError = null;
          this.fileUploadButtonStatus = false;
          this.fileDeleteButtonStatus = false;
  
          for (let i = 0; i < event.length; i++) {
              event[i]['uploadStatus'] = false;
              this.fileInfo.append('files[]', event[i]);
          }
  
          this.fileInfoLength = Array.from(this.fileInfo.keys()).length;
      }
    }

    resetUploadFileStatus(index) {
      let filesUploaded = [];
      let i = 0;
      for (let [key, file] of this.fileInfo.entries()) {
        filesUploaded.push(file);
      }

      this.fileInfo.delete("files[]");

      for(let i = 0; i < filesUploaded.length; i++) {
        if(i == index) {
          filesUploaded[i]['uploadStatus'] = true;
        }
        this.fileInfo.append('files[]', filesUploaded[i]);
      }
    }

    formatByte(byte) {
      return formatBytes(byte);
    }

    uploadSpecificFile(index) {
      this.fileUploadButtonStatus = true;
      this.fileDeleteButtonStatus = true;
      
      var fileData;
      
      this.index = index;

      return new Promise((resolve, reject) => {
        let idx = 0;
        // Disabled button --
        for(var [key, fileD] of this.fileInfo.entries()) {
          if(this.index == idx) {
            fileData = fileD;
          }
          idx++;
        }


        this.disabled_start_file_0 = true;
        this.disabled_start_file_1 = true;
        this.disabled_start_file_2 = true;

        // Disable delete button

        this.disabled_delete_file_0 = true;
        this.disabled_delete_file_1 = true;
        this.disabled_delete_file_2 = true;

        // Replace special characters and emojis with underscores
        const sanitizedFileName = fileData.name.replace(/[^\w\d.]+/g, ' ');


        var firstWordFileName = sanitizedFileName.split(' ')[0];
      
     
        // Its a first word
        if(firstWordFileName.includes('.')) {
          firstWordFileName = firstWordFileName.split('.')[0];
        }

        const uuniqueId = uuid.v4();
            
        // Generate an 8-character UUID
        const uniqueId =  uuniqueId.slice(0, 8);

        const extension = getFileExtension(fileData.name);
        
        // Construct the new file name
        this.updatedFileName = `${firstWordFileName}_${uniqueId}${extension}`;

        // Modify the file name - Ends here
        const formData = {
          fileName: this.updatedFileName,
          mimetype: fileData.type,
          location: "cs-uploads-"+this.fileUploadLocationId
        }
       
        if(fileData.size > CONSTANTS.CHUNK_SIZE) { 
          // Multipart upload
          this.shared.startUpload(formData).subscribe({
            next: (response) => {
              const result = JSON.parse(JSON.stringify(response));
              this.multiPartUpload(result.uploadId, fileData).then((resp) => {
                  return this.completeUpload(result.uploadId, resp);
              }).then((resp) =>  {
                  const parseData = JSON.parse(JSON.stringify(resp));
                  idx = 0;
                  this.resetUploadFileStatus(this.index);
                  this.isFileUploaded = true;
                  this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
                  this.customerUploadedLinks.push(parseData.data.Location);
                  // Disable logic

                  // Remove Disabled button logic --
                  for(var [key, fileD] of this.fileInfo.entries()) {
                      if(!fileD.uploadStatus) {
                        if(this.index == 0) {
                          this.disabled_start_file_1 = this.pecentage_1 == 100 ? true : false;
                          this.disabled_start_file_2 = this.pecentage_2 == 100 ? true : false;
                          this.disabled_delete_file_1 = this.pecentage_1 == 100 ? true : false;
                          this.disabled_delete_file_2 = this.pecentage_1 == 100 ? true : false;
                        }
                        if(this.index == 1) {
                          this.disabled_start_file_0 = this.pecentage_0 == 100 ? true : false;
                          this.disabled_start_file_2 = this.pecentage_2 == 100 ? true : false;
                          this.disabled_delete_file_0 = this.pecentage_0 == 100 ? true : false;
                          this.disabled_delete_file_2 = this.pecentage_2 == 100 ? true : false;
                        } 
                        if(this.index == 2) {
                          this.disabled_start_file_0 = this.pecentage_0 == 100 ? true : false;
                          this.disabled_start_file_1 = this.pecentage_1 == 100 ? true : false;
                          this.disabled_delete_file_0 = this.pecentage_0 == 100 ? true : false;
                          this.disabled_delete_file_1 = this.pecentage_1 == 100 ? true : false;
                        } 
                      }
                      idx++;
                  }

                  // Enable file delete
                  this.disabled_delete_file_0 = false;
                  this.disabled_delete_file_1 = false;
                  this.disabled_delete_file_2 = false;
                  this.fileDeleteButtonStatus = false;

                  // Show success toast
                  this.toastService.showToast('File uploaded successfully!', 'fas fa-check', '#27ae60', 'slide-in-slide-out');

                  resolve(resp);
              }).catch((err) => {
                  console.error(err);
                  // Show error toast
                  this.toastService.showToast('File upload failed!', 'fas fa-close', '#c0392b', 'slide-in-slide-out');
                  reject(err);
              })
            },
            error: (error) => {
              console.log(error);
            }
          })
        } else {
          // Single file upload 

          const formDataFile: FormData = new FormData();
          formDataFile.append('file', fileData);
          formDataFile.append('location', formData.location);

          this.shared.upload(formDataFile).subscribe({
            next: (response) => {
              const result = JSON.parse(JSON.stringify(response));
              this.customerUploadedLinks.push(result.Location);

              this.isFileUploaded = true;
              this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
              this.resetUploadFileStatus(this.index);

              if(result.status === 200) {
                if(this.index == 0) {
                  this.pecentage_0 = 100;
                } else if(this.index == 1) {
                  this.pecentage_1 = 100;
                } else if(this.index == 2) {
                  this.pecentage_2 = 100;
                }

                // Remove Disabled button logic --
                idx = 0;
                
                for(var [key, fileD] of this.fileInfo.entries()) {
                  if(!fileD.uploadStatus) {
                    if(this.index == 0) {
                      this.disabled_start_file_1 = this.pecentage_1 == 100 ? true : false;
                      this.disabled_start_file_2 = this.pecentage_2 == 100 ? true : false;
                      this.disabled_delete_file_1 = this.pecentage_1 == 100 ? true : false;
                      this.disabled_delete_file_2 = this.pecentage_1 == 100 ? true : false;
                    }
                    if(this.index == 1) {
                      this.disabled_start_file_0 = this.pecentage_0 == 100 ? true : false;
                      this.disabled_start_file_2 = this.pecentage_2 == 100 ? true : false;
                      this.disabled_delete_file_0 = this.pecentage_0 == 100 ? true : false;
                      this.disabled_delete_file_2 = this.pecentage_2 == 100 ? true : false;
                    } 
                    if(this.index == 2) {
                      this.disabled_start_file_0 = this.pecentage_0 == 100 ? true : false;
                      this.disabled_start_file_1 = this.pecentage_1 == 100 ? true : false;
                      this.disabled_delete_file_0 = this.pecentage_0 == 100 ? true : false;
                      this.disabled_delete_file_1 = this.pecentage_1 == 100 ? true : false;
                    } 
                  }
                  idx++;
                }

                // Enable file delete
                this.disabled_delete_file_0 = false;
                this.disabled_delete_file_1 = false;
                this.disabled_delete_file_2 = false;
                this.fileDeleteButtonStatus = false;

                // Show success toast
                this.toastService.showToast('File uploaded successfully!', 'fas fa-check', '#27ae60', 'slide-in-slide-out');
        
              } else {
                if(this.index == 0) {
                  this.pecentage_0 = 0;
                } else if(this.index == 1) {
                  this.pecentage_1 = 0;
                } else if(this.index == 2) {
                  this.pecentage_2 = 0;
                }

                idx = 0;

                // Remove Disabled button logic --
                for(var [key, fileD] of this.fileInfo.entries()) {
                  if(!fileD.uploadStatus) {  
                    if(this.index == 0) {
                      this.disabled_start_file_1 = this.pecentage_1 == 100 ? true : false;
                      this.disabled_start_file_2 = this.pecentage_2 == 100 ? true : false;
                      this.disabled_delete_file_1 = this.pecentage_1 == 100 ? true : false;
                      this.disabled_delete_file_2 = this.pecentage_1 == 100 ? true : false;
                    }
                    if(this.index == 1) {
                      this.disabled_start_file_0 = this.pecentage_0 == 100 ? true : false;
                      this.disabled_start_file_2 = this.pecentage_2 == 100 ? true : false;
                      this.disabled_delete_file_0 = this.pecentage_0 == 100 ? true : false;
                      this.disabled_delete_file_2 = this.pecentage_2 == 100 ? true : false;
                    } 
                    if(this.index == 2) {
                      this.disabled_start_file_0 = this.pecentage_0 == 100 ? true : false;
                      this.disabled_start_file_1 = this.pecentage_1 == 100 ? true : false;
                      this.disabled_delete_file_0 = this.pecentage_0 == 100 ? true : false;
                      this.disabled_delete_file_1 = this.pecentage_1 == 100 ? true : false;
                    } 
                  }
                  idx++;
                }
                
              }
              resolve(response)
            },
            error: (error) => {
              console.log(error);
              // Show error toast
              this.toastService.showToast('File upload failed!', 'fas fa-close', '#c0392b', 'slide-in-slide-out');
              reject(error);
            }
          })
        }
      })

     
    }

    multiPartUpload(uploadId, fileToUpload) {
      return new Promise(async(resolve, reject) => {
        const CHUNKS_COUNT = Math.floor(fileToUpload.size / CONSTANTS.CHUNK_SIZE) + 1;
        let promisesArray = [];
        let params = {};
        let start, end, chunks, blob, file;

        // console.log(`Total File Size: ${fileToUpload.size} bytes`);
        // console.log(`Number of Chunks: ${CHUNKS_COUNT}`);

        for (let index = 1; index < CHUNKS_COUNT + 1; index++) {
          start = (index - 1) * CONSTANTS.CHUNK_SIZE
          end = (index) * CONSTANTS.CHUNK_SIZE
          chunks = (index < CHUNKS_COUNT) ? fileToUpload.slice(start, end) : fileToUpload.slice(start);
          
          blob = new Blob([chunks], {type: fileToUpload.type });
          file = new File([blob], this.updatedFileName);

          const formData: FormData = new FormData();
         
          
          params = {
            key: this.updatedFileName,
            totalSize: fileToUpload.size,
            partNo: index,
            uploadId: uploadId
          }
          
          // formData.append('file', file);
          formData.append('data', JSON.stringify(params));
          formData.append('location', "cs-uploads-"+this.fileUploadLocationId)
             
          const logsData = file as File;
          const logsDd = formData.get('data');
          const logsLocation = formData.get('location');

          

          // Calculate the total size of the data
          const totalSize = logsData.size + new Blob([logsDd]).size + new Blob([logsLocation]).size;

          // formData.delete("file");

          // Log the total size of the data before sending
          console.log(`Chunk ${index} - Total size: ${totalSize} bytes`);
          
          const getPresignURL = await this.getPreSignURL(formData);

          // Upload parts using presign URL
          const uploadChunks = await this.uploadChuckUsingPreSignURL(getPresignURL, file, fileToUpload.type, fileToUpload.size, totalSize);
    
          promisesArray.push(uploadChunks);

          if(promisesArray.length == CHUNKS_COUNT) {
            resolve(promisesArray);
          }
        }
      })
    }

    getPreSignURL(formData) {
      return new Promise((resolve, reject) => {
        this.shared.getPreSignURL(formData).subscribe({
          next: (response) => {
            const result = JSON.parse(JSON.stringify(response));
            resolve(result);
          },
          error: (error) => {
            console.log(error);
            reject(error);
          }
        })
      })
    }

    uploadChuckUsingPreSignURL(data, formData, type, totalSize, chunkSize) {
      return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(data.data, {
                method: 'PUT',
                headers: {
                    'Content-Type': type, // Set the appropriate content type
                },
                body: formData, // Use the actual file buffer from FormData
            });

            if (!response.ok) {
                // Handle error based on the response status
                reject(new Error(`Failed to upload part. Status: ${response.status}`));
                return;
            }

            const eTag = response.headers.get('ETag');
            const percentage = (Math.floor(chunkSize / totalSize * 100));
           
            if(this.index == 0) {
              this.pecentage_0 += percentage;
            } else if(this.index == 1) {
              this.pecentage_1 += percentage;
            } else if(this.index == 2) {
              this.pecentage_2 += percentage;
            }

            // If successful, resolve the promise
            resolve({
              data: { ETag: eTag }
            });
        } catch (error) {
            // Handle any other errors that may occur during the upload
            this.toastService.showToast('File upload failed!', 'fas fa-close', '#c0392b', 'slide-in-slide-out');
            reject(error);
        }
    });
    }

    async completeUpload(uploadId, resp) {
      let resolvedArray = await Promise.all(resp)
     
      let uploadPartsArray = [];
      resolvedArray.forEach((resolvedPromise, index) => {
        uploadPartsArray.push({
          ETag: resolvedPromise.data.ETag,
          PartNumber: index + 1
        })
      })

      // Complete upload here
      let params = {
        fileName: this.updatedFileName,
        parts: uploadPartsArray,
        uploadId: uploadId,
        location: "cs-uploads-"+this.fileUploadLocationId
      }

      return new Promise((resolve, reject) => {
        this.shared.completeUpload(params).subscribe({
          next: (response) => {
            if(this.index == 0) {
              this.pecentage_0 = 100;
            } else if(this.index == 1) {
              this.pecentage_1 = 100;
            } else if(this.index == 2) {
              this.pecentage_2 = 100;
            }
            resolve(response);
          },
          error: (error) => {
            reject(error);
          }

        })
      })
    }

    confirm_deleteAllFiles() {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-width-5',
          cancelButton: 'btn btn-white btn-width-5 mr-left-5'
        },
        buttonsStyling: false
      });
    
      swalWithBootstrapButtons.fire({
        title: 'Confirm Deletion',
        text: 'Are you sure you want to delete all files? This action is irreversible.',
        icon: 'question', // Change the icon to 'question'
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonText: 'Cancel'
      }).then(async(res) => {
        if (res.value) {
          if(this.customerUploadedLinks.length > 0) {
            for (let i = 0; i < this.customerUploadedLinks.length; i++) {
              await Promise.all(this.customerUploadedLinks.map(async (_, i) => {
                try {
                  await this.deleteSpecificFile_API_Call(i);
                } catch (error) {
                  this.toastService.showToast('File delete failed!', 'fas fa-close', '#c0392b', 'slide-in-slide-out');
                }
              }));
  
              this.deleteAllFiles();
              swalWithBootstrapButtons.fire(
                'Success!',
                'All files have been deleted.',
                'success'
              );
            }
          } else {
            this.deleteAllFiles();
            swalWithBootstrapButtons.fire(
              'Success!',
              'All files have been deleted.',
              'success'
            );
          }
        }
      });
    }

    confirm_deleteSpecificFiles(index) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-width-5',
          cancelButton: 'btn btn-white btn-width-5 mr-left-5'
        },
        buttonsStyling: false
      });
    
      swalWithBootstrapButtons.fire({
        title: 'Confirm Deletion',
        text: 'Are you sure you want to delete this specific file? This action is irreversible.',
        icon: 'question', // Change the icon to 'question'
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonText: 'Cancel'
      }).then(async(res) => {
        if (res.value) {
          try {
            if(!this.customerUploadedLinks[index]) {
              swalWithBootstrapButtons.fire(
                'Success!',
                'The specific file has been deleted.',
                'success'
              );
              this.deleteSpecificFile_API_Call(index);
            } else {
              const result : any = await this.deleteSpecificFile_API_Call(index);
          
              if (!result.status) {
                this.toastService.showToast('File delete failed!', 'fas fa-close', '#c0392b', 'slide-in-slide-out');
              } else {
                swalWithBootstrapButtons.fire(
                  'Success!',
                  'The specific file has been deleted.',
                  'success'
                );
              }
            }
            
          } catch (error) {
            console.error("Error:", error);
            this.toastService.showToast('File delete failed!', 'fas fa-close', '#c0392b', 'slide-in-slide-out');
          }
        }
      });
    }
    

    deleteAllFiles() {
      // Keep uploaded file and delete not uploaded file.
      this.fileInfo.delete("files[]");
      this.customerUploadedLinks = [];
      this.existingFileNames = [];
      this.pecentage_0 = 0;
      this.pecentage_1 = 0;
      this.pecentage_2 = 0; 
      this.fileInfoLength = 0;
      this.disabled_start_file_0 = false;
      this.disabled_start_file_1 = false;
      this.disabled_start_file_2 = false;
      
      this.fileUploadButtonStatus = true;
      this.fileDeleteButtonStatus = true;
     
      this.customError = null;
      this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
    }

    deleteSpecificFile_API_Call(index) {
      // File is not uploaded
      if(!this.customerUploadedLinks[index]) {
        this.deleteSpecificFile(index);
      } else { // File is uploaded
        const body = {
          key:  this.customerUploadedLinks[index] // File path
        }
        return new Promise((resolve, reject) => {
          this.shared.deleteFile(body).subscribe({
            next: (response) => {
              const result = JSON.parse(JSON.stringify(response));
              this.deleteSpecificFile(index);
              resolve({
                status: true
              })
            },
            error: (error) => {
              console.log("Error:", error);
              reject({
                status: false
              })
            }
          })
        })
      }
    }

    deleteSpecificFile(index) {
      const listArrayFile = this.fileInfo.getAll("files[]");
       
      if(index > -1) { // only splice array when item is found
        listArrayFile.splice(index, 1); // 2nd parameter means remove one item only
        this.customerUploadedLinks.splice(index, 1);
        this.existingFileNames.splice(index, 1);
        this[`pecentage_${index + 1}`] = 0;

        
        this[`disabled_start_file_${index + 1}`] = false; 
      
        this.fileInfoLength = listArrayFile.length;

        this.fileInfo.delete("files[]");
        for(let i = 0; i < listArrayFile.length; i++) {
          this.fileInfo.append('files[]', listArrayFile[i]);
        }
      }

      if(this.fileInfoLength === 0) {
        this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
        this.fileUploadButtonStatus = true;
        this.fileDeleteButtonStatus = true;
      }
    }

    async uploadAll() {
      // for(let i = 0; i < this.fileInfo.length; i++) {
      let idx = 0;  
      for(var [key, file] of this.fileInfo.entries()) {
        if(!file.uploadStatus) {
          await this.uploadSpecificFile(idx);
        }
        idx++;
      }
    }

    customLinks_1(data) {
      this.customLink_1 = data;
      if(this.urlValidator.test(this.customLink_1)) {
        this.customLink_Error_1 = null;
        this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
      } else {
        this.customLink_Error_1 = "Invalid url, custom links should start with http:// or https:// and"
        this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
      }
    }
    
    customLinks_2(data) {
      this.customLink_2 = data;
      if(this.urlValidator.test(this.customLink_2)) {
        this.customLink_Error_2 = null;
        this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
      } else {
        if(!this.customLink_2) {
          this.customLink_Error_2 = null;
          this.isEnabledSubmit = false;
        } else {
          this.customLink_Error_2 = "Invalid url, custom links should start with http:// or https://"
          this.isEnabledSubmit = true;
        }
      }
    }

    customLinks_3(data) {
      this.customLink_3 = data;
      if(this.urlValidator.test(this.customLink_3)) {
        this.customLink_Error_3 = null;
        this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
      } else {
        if(!this.customLink_3) {
          this.customLink_Error_3 = null;
          this.isEnabledSubmit = false;
        } else {
          this.customLink_Error_3 = "Invalid url, custom links should start with http:// or https://"
          this.isEnabledSubmit = true;
        }
      }
    }

    customLinks_4(data) {
      this.customLink_4 = data;
      if(this.urlValidator.test(this.customLink_4)) {
        this.customLink_Error_4 = null;
        this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
      } else {
        if(!this.customLink_4) {
          this.customLink_Error_4 = null;
          this.isEnabledSubmit = false;
        } else {
          this.customLink_Error_4 = "Invalid url, custom links should start with http:// or https://"
          this.isEnabledSubmit = true;
        }
      }
    }

    customLinks_5(data) {
      this.customLink_5 = data;
      if(this.urlValidator.test(this.customLink_5)) {
        this.customLink_Error_5 = null;
        this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
      } else {
        if(!this.customLink_5) {
          this.customLink_Error_5 = null;
          this.isEnabledSubmit = false;
        } else {
          this.customLink_Error_5 = "Invalid url, custom links should start with http:// or https://"
          this.isEnabledSubmit = true;
        }
      }
    }

    onChangeWorkDetails(data) {
       this.workDetails = data;
       this.isEnabledSubmit = this.checkValidationOfSubmitbtn();
    }

    checkValidationOfSubmitbtn() {
      // console.log("Custom link:", this.customLink_1);
      // console.log("File provided by customer:", this.isFileProvidedByCustomer);
      // console.log("File uploaded:", this.isFileUploaded);
      // console.log("Custom file provided:", this.isCustomFileProvided);
      // console.log("Work details:", this.workDetails);

      if(this.customerUploadedLinks.length > 0 && this.isFileProvidedByCustomer && this.isFileUploaded && this.isCustomFileProvided && this.workDetails) { 
        return false;
      } else if(!this.isFileProvidedByCustomer && !this.isFileUploaded && !this.isCustomFileProvided && this.workDetails) {
        return false;
      } else if(this.isFileProvidedByCustomer && !this.isCustomFileProvided && this.customLink_1 && !this.customLink_Error_1 && this.workDetails) {
        return false;
      } else {
        return true;
      }
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
        text: 'This process steps is irreversible.',
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonText: 'Cancel'
      }).then((res) => {
        if (res.value) {
          swalWithBootstrapButtons.fire(
            'Success!',
            'You have made it.',
            'success'
          )
          this.submitRequest();
        }
      })
    }
    
    submitRequest() {
      this.isEnabledSubmit = true;
      this.confirmButtonText = "Please wait";
      this.showLoader = true;
      if(this.customLink_1) {
        this.customerUploadedLinks.push(this.customLink_1);
      } 

      if(this.customLink_2) {
        this.customerUploadedLinks.push(this.customLink_2);
      } 

      if(this.customLink_3) {
        this.customerUploadedLinks.push(this.customLink_3);
      } 

      if(this.customLink_4) {
        this.customerUploadedLinks.push(this.customLink_4);
      } 
      
      if(this.customLink_5) {
        this.customerUploadedLinks.push(this.customLink_5);
      } 

      const currUser = JSON.parse(localStorage.getItem('currentUser'));

      const data = {
        name: currUser["custom:name"],
        category: {
          id: this.selectedCategoryId,
          name: this.selectedCategoryName,
          icon: this.selectedCategoryIcon
        },
        approximateTimeLine: {
          selectedTimeline: this.selectedTimeline,
          selectedTimelineInHrs: this.selectedTimelineInHrs
        },
        estimateTimeToCompleteWork: null,
        isHavingFile: this.isFileProvidedByCustomer,
        workDetails: this.workDetails,
        isCustomFileProvided: this.isCustomFileProvided,
        customerUploadedLinks: this.customerUploadedLinks,
        bussinessAnalystsWith: [],
        dataAnalystsWith: [],
        currentPlan: currUser['custom:selectedPlan'],
        currentStatus: this.currentStatus,
        customSteps: this.customSteps,
        fileLocation: this.isCustomFileProvided == true ? this.fileUploadLocationId : ""
      }

      this.shared.submitRequest(data).subscribe({
        next: async(response) => {
          const result = JSON.parse(JSON.stringify(response));
          const sendMessage_toBussinessAnalysts = result.data.bussinessAnalystsWith.pop();
          
          // sendMessage_toBussinessAnalysts.profileUrl = currUser['custom:profileurl'];
          sendMessage_toBussinessAnalysts.customerProfileUrl = currUser['custom:profileurl'];
          // Websockets integration here --- 
          // 1. Add bussiness analysts in the group
          // 2. Send message to group, who are connected to it.-- Right now stage - Customer and Bussiness Analysts
          // 3. Send push notification to customer and bussiness analysts
          
          // Steps proceed here - 
          // 1. Add bussiness analysts in the group
          let joinBussinessAnalystsToNewRoom = {
              action: "joinroom_ba",
              message: {
                sendRoomToAssignedPeople: true,
                title: CONSTANTS.BUSSINESS_ANALYSTS_ASSIGNED_TOCHAT.title,
                body: sendMessage_toBussinessAnalysts.name+' '+CONSTANTS.BUSSINESS_ANALYSTS_ASSIGNED_TOCHAT.body
              },
              roomid: result.data.id,
              customerData: {
                name: currUser["custom:name"],
                userId: currUser["cognito:username"],
                email: currUser.email,
                profileUrl: currUser['custom:profileurl']
              },
              bussinessAnalystsData: sendMessage_toBussinessAnalysts
          }

          this.wbsocketService.send(joinBussinessAnalystsToNewRoom);
          
          setTimeout(() => {
            if(this.customSteps.length == 6) {
              this.router.navigate([`/task/quick-request/list`]);
            } else {
              this.router.navigate([`/task/project-request/list`]);
            }
          }, 5000)
        },
        error: (error) => {
          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success btn-width-5',
              cancelButton: 'btn btn-white btn-width-5 mr-left-5'
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: 'Error !',
            text: error,
            icon: 'error',
            showConfirmButton: false,
            showCancelButton: true,
            allowOutsideClick: false,
            cancelButtonText: 'Cancel'
          })

          this.isEnabledSubmit = false;
          this.confirmButtonText = "Submit";
          this.showLoader = false;

          this.router.navigate([`/balance/add-credit`]);

        }
      })
    }

    @ViewChild('selectCatagory') selectCatagory: ElementRef;
    @ViewChild('selectApproxTimeline') selectApproxTimeline: ElementRef;
    @ViewChild('doYouHaveFile') doYouHaveFile: ElementRef;
    @ViewChild('fileOrLink') fileOrLink: ElementRef;
    closeDropdownOnclickOutside(event: MouseEvent) {
      if (!this.selectCatagory?.nativeElement.contains(event.target as Node)) {
        this.showCategory = false;
      }
      
      if (!this.selectApproxTimeline?.nativeElement.contains(event.target as Node)) {
        this.showTimeline = false;
      }

      if (!this.doYouHaveFile?.nativeElement.contains(event.target as Node)) {
        this.showOrderHasFile = false;
      }

      if (!this.fileOrLink?.nativeElement.contains(event.target as Node)) {
        this.showCustomFileLinks = false;
      }
    }


    ngOnDestroy() {
      // this.upcomingUserSubscription.unsubscribe();
      this.currentUserSubscription.unsubscribe();
    }
}
