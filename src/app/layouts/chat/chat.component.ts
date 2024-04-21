import { Component, ViewEncapsulation } from '@angular/core';
import { CONSTANTS } from '../../config/constants';
import { userInteractionFlow } from '../../data/data';
import { ROLES } from '../../config/roles';
import { CommonService }    from '../../services/common.service';
import { SharedservicesService }  from '../../services/sharedservices.service';
import { WebSocketService }  from '../../services/websockets.service';
import { ToastService } from '../../services/toast.service'; 
import { getFileExtension } from '../../utils';

import * as uuid from 'uuid';
import * as $ from "jquery";
@Component({
	selector: 'chat',
	templateUrl: './chat.component.html',
    encapsulation: ViewEncapsulation.None,
	styleUrls: ['./chat.component.scss']
})

export class ChatComponent {
    constants: any;
    acceptFile: any;
    chatRequestIds: any = {
        "result:" : {
            "Items": []
        }
    };
    backupChatRequestIds: any = {
        "result:" : {
            "Items": []
        }
    };
    chatAnalystsInfo: any = {
        "result": []
    };
    backUpchatAnalystsInfo: any = {
        "result": []
    };
    analystsUserIds: any = [];
    getSelectedUsersChatHistory: any = [];
    getSelectedGroupChatHistory: any = [];

    allAnalystsChatHistory: any;
    allGroupChatHistory: any;

    selectedOrderId: any;
    chatHeader: any;
    chatInfo: any;
    imageName: any;
    imageHeaderMessage: any;
    messageBody: any;
    userInfo: any;
    senderUserId: any;
    profileUrl: any;
    logo: any;
    ordersImage: any;
    updatedFileName: any;
    
    receiverUserName: any;
    receiverUserId: any;
    receiverUserEmail: any;
    setIntervalTime: any;
    customError: any;
    fileUploadLocation: any;
    disabledButtonQNABot: any = {};
    
    // Show unread messages
    unreadMessagePerUser: any = {};
    unreadMessageCountPerUser: number = 0;

    // to show the outside box

    totalUnreadMessageCount: number = 0;

    // File uploads
    fileInfo: any = new FormData();
    fileUploadLocationId: any;
    isLoadingChat: boolean;
    showWelcomeMessage : boolean;
    showChatPopup: boolean;
    showOrderIdText: boolean;
    dynamicClassSelection: boolean;
    isGroupChatSelected: boolean;
    isAnalysts: boolean;
    userInteraction: boolean;
    sendChatMessageBtn: boolean;

    fileUploadButtonStatus: boolean;
    preUploadFileStatus: boolean;


    // User Interaction Flow
    userInteractionFlow: any;
    userInteractionAPI: any = [];
    current_date: any;
    showTypingLoader: boolean;
    customerSendPrevChatBot: boolean;
    showEmoji: boolean;
    userInteractionLength: number;

    adjustTextareaSize() {
        const textarea = document.querySelector('.autosize-textarea') as HTMLTextAreaElement;
        textarea.style.height = '0'; // Reset the height to get the correct scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the content
    }
    
    constructor(private shared: SharedservicesService, private toastService: ToastService, private wbsocketService: WebSocketService, private commonService: CommonService) {
        this.showWelcomeMessage = true;
        this.showChatPopup = false;
        this.showOrderIdText = false;
        this.dynamicClassSelection = false;
        this.isLoadingChat = false;
        this.isGroupChatSelected = false;
        this.userInteraction = false;
        this.isAnalysts = false;
        this.fileUploadButtonStatus = true;
        this.preUploadFileStatus = false;
        this.showTypingLoader = false;
        this.showEmoji = false;
        this.disabledButtonQNABot = {
            firstStepBtn: true,
            secondStepBtn: true
        };
        this.fileUploadLocationId = uuid.v4();
        this.constants = CONSTANTS;
        this.current_date = new Date();
        this.userInteractionLength = 0;
       
        this.userInteractionFlow = userInteractionFlow;
        
        this.acceptFile = CONSTANTS.ACCEPT_FILE;
        this.imageName = "../../../assets/img/chat/default-profile.svg";
        this.imageHeaderMessage = "../../../assets/img/chat/chatheader_msg1.svg"
        this.ordersImage = "../../../assets/img/chat/user-12.jpeg";
        this.logo = "../../../assets/img/logo/apple-icon.png"
        this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.senderUserId = this.userInfo.sub;

       
        // Get all the chatRequest Ids
        this.shared.listChatRequestIds().subscribe({
            next: async(response) => {
                this.chatRequestIds = JSON.parse(JSON.stringify(response));
                this.backupChatRequestIds = JSON.parse(JSON.stringify(response));

                // Get all the analysts chat history
                this.getAllOrderChatHistoryDetails();
            },
            error: (error) => {
                console.log(error);
            }
        })

        if(this.userInfo['custom:role'] != ROLES.CUSTOMER) {
            // If he/she is not a customer
            this.shared.listChatAnalysts().subscribe({
                next: async(response) => {
                    this.chatAnalystsInfo = JSON.parse(JSON.stringify(response));
                    this.backUpchatAnalystsInfo  = JSON.parse(JSON.stringify(response));
                    for(let i = 0; i < this.chatAnalystsInfo.result.Items.length; i++) {
                       this.analystsUserIds.push(this.chatAnalystsInfo.result.Items[i].id);
                       // Intially count is 0 alway, that means all message read
                       this.unreadMessagePerUser[this.chatAnalystsInfo.result.Items[i].id] = 0;

                    }

                    // Get all the analysts chat history
                    this.getPrivateChatHistoryDetails();
                },
                error: (error) => {
                    console.log(error);
                }
            })
        }

        // Received Private Message
        this.commonService._subjectReceivedPrivateMessage$.subscribe((newMessage) => {
			const receivedMessage = JSON.parse(JSON.stringify(newMessage));
            if(receivedMessage.status === true) {
                // Message send single tick

            } else {
                if(receivedMessage.senderUserId) {
                    this.scrollToBottom();

                    // If there is a file attachments
                    if(receivedMessage.fileAttachment) {
                        var fileName = receivedMessage.messageBody.split('/');
                        fileName = decodeURI(fileName.pop());
                        var fileExtention = fileName.split(".")[1];
                    }

                    if(receivedMessage.senderUserId == this.receiverUserId) {
                        this.allAnalystsChatHistory[receivedMessage.senderUserId] = [{
                            fileAttachment: receivedMessage.fileAttachment,
                            fileName: fileName,
                            fileExtention: fileExtention,
                            messageBody: receivedMessage.messageBody,
                            messageType: receivedMessage.messageType,
                            senderEmailId: receivedMessage.senderEmailId,
                            senderName: receivedMessage.senderName,
                            senderUserId: receivedMessage.senderUserId,
                            receiverUserName: receivedMessage.receiverUserName,
                            receiverUserId: receivedMessage.receiverUserId,
                            receiverUserEmail: receivedMessage.receiverUserEmail,
                            domainName: receivedMessage.domainName,
                            id: receivedMessage.id,
                            status: receivedMessage.status,
                            time: receivedMessage.time
                        }];
    
                        
                        this.unreadMessageCountPerUser = 0;
                        this.unreadMessagePerUser[receivedMessage.senderUserId] = this.unreadMessageCountPerUser; 
                         
                        // merge duplicate values as well.
                        this.getSelectedUsersChatHistory = [...this.getSelectedUsersChatHistory, ...this.allAnalystsChatHistory[receivedMessage.senderUserId]]; 
                        this.allAnalystsChatHistory[receivedMessage.senderUserId] = this.getSelectedUsersChatHistory;
                        
                        this.readMessage();
                    } else {
                        this.totalUnreadMessageCount = 0;
                        this.allAnalystsChatHistory[receivedMessage.senderUserId].push({
                            fileAttachment: receivedMessage.fileAttachment,
                            fileName: fileName,
                            fileExtention: fileExtention,
                            messageBody: receivedMessage.messageBody,
                            messageType: receivedMessage.messageType,
                            senderEmailId: receivedMessage.senderEmailId,
                            senderName: receivedMessage.senderName,
                            senderUserId: receivedMessage.senderUserId,
                            receiverUserName: receivedMessage.receiverUserName,
                            receiverUserId: receivedMessage.receiverUserId,
                            receiverUserEmail: receivedMessage.receiverUserEmail,
                            domainName: receivedMessage.domainName,
                            id: receivedMessage.id,
                            status: receivedMessage.status,
                            time: receivedMessage.time
                        });
                        this.unreadMessageCountPerUser = this.allAnalystsChatHistory[receivedMessage.senderUserId].filter(s => s.senderUserId != this.senderUserId && s.id && s.status == 'send').length; 
                        this.unreadMessagePerUser[receivedMessage.senderUserId] = this.unreadMessageCountPerUser; 
                        
                        // Get total message count:-
                        for(let totalMessageCnt in this.unreadMessagePerUser) {
                            this.totalUnreadMessageCount +=  this.unreadMessagePerUser[totalMessageCnt];
                        }

                        this.playAudio().then((res) => {
                            this.pageTitleChange();
                        })
                    }                
                }
            }
		});


        // Received Group Message
        this.commonService._subjectReceivedGroupMessage$.subscribe((newMessage) => {
			const receivedMessage = JSON.parse(JSON.stringify(newMessage));
            
            if(receivedMessage.senderUserId) {
                this.scrollToBottom();
                
                // If there is a file attachments
                if(receivedMessage.fileAttachment) {
                    var fileName = receivedMessage.messageBody.split('/');
                    fileName = decodeURI(fileName.pop());
                    var fileExtention = fileName.split(".")[1];
                }

                if(receivedMessage.senderUserId == this.receiverUserId) {
                    this.allGroupChatHistory[receivedMessage.roomId] = [{
                        fileAttachment: receivedMessage.fileAttachment,
                        fileName: fileName,
                        fileExtention: fileExtention,
                        messageBody: receivedMessage.messageBody,
                        messageType: receivedMessage.messageType,
                        senderEmailId: receivedMessage.senderEmailId,
                        senderName: receivedMessage.senderName,
                        senderProfilePic: receivedMessage.senderProfilePic,
                        senderUserId: receivedMessage.senderUserId,
                        domainName: receivedMessage.domainName,
                        roomId: receivedMessage.roomId,
                        id: receivedMessage.id,
                        stage: "production",
                        status: receivedMessage.status,
                        time: receivedMessage.time
                    }];

                    
                    this.unreadMessageCountPerUser = 0;
                    this.unreadMessagePerUser[receivedMessage.roomId] = this.unreadMessageCountPerUser; 
                     
                    // merge duplicate values as well.
                    this.getSelectedGroupChatHistory = [...this.getSelectedGroupChatHistory, ...this.allGroupChatHistory[receivedMessage.roomId]]; 
                    this.allGroupChatHistory[receivedMessage.roomId] = this.getSelectedGroupChatHistory;
                    this.readMessage();
                } else {
                    this.totalUnreadMessageCount = 0;
                    if(!this.allGroupChatHistory[receivedMessage.roomId]) {
                        this.allGroupChatHistory[receivedMessage.roomId] = [];
                    }
                    this.allGroupChatHistory[receivedMessage.roomId].push({
                        fileAttachment: receivedMessage.fileAttachment,
                        fileName: fileName,
                        fileExtention: fileExtention,
                        messageBody: receivedMessage.messageBody,
                        messageType: receivedMessage.messageType,
                        senderEmailId: receivedMessage.senderEmailId,
                        senderName: receivedMessage.senderName,
                        senderUserId: receivedMessage.senderUserId,
                        senderProfilePic: receivedMessage.senderProfilePic,
                        roomId: receivedMessage.roomId,
                        stage: "production",
                        domainName: receivedMessage.domainName,
                        id: receivedMessage.id,
                        status: receivedMessage.status,
                        time: receivedMessage.time
                    });

                    if(this.userInfo['custom:role'] === "customer") {
                     this.unreadMessageCountPerUser = this.allGroupChatHistory[receivedMessage.roomId].filter(s => s.senderUserId != this.senderUserId && s.id && s.status.customer == 'send').length;     
                    } if(this.userInfo['custom:role'] === "bussiness-analysts") {
                        this.unreadMessageCountPerUser = this.allGroupChatHistory[receivedMessage.roomId].filter(s => s.senderUserId != this.senderUserId && s.id && s.status.bussiness_analysts == 'send').length;     
                    } if(this.userInfo['custom:role'] === "data-analysts") {
                        this.unreadMessageCountPerUser = this.allGroupChatHistory[receivedMessage.roomId].filter(s => s.senderUserId != this.senderUserId && s.id && s.status.data_analysts == 'send').length;     
                    } if(this.userInfo['custom:role'] === "admin") {
                        this.unreadMessageCountPerUser = this.allGroupChatHistory[receivedMessage.roomId].filter(s => s.senderUserId != this.senderUserId && s.id && s.status.admin == 'send').length;     
                    }

                   
                    this.unreadMessagePerUser[receivedMessage.roomId] = this.unreadMessageCountPerUser; 
                    
                    // Get total message count:-
                    for(let totalMessageCnt in this.unreadMessagePerUser) {
                        this.totalUnreadMessageCount +=  this.unreadMessagePerUser[totalMessageCnt];
                    }

                    this.playAudio().then((res) => {
                        this.pageTitleChange();
                    })
                }                
            }
		});

        this.commonService._subjectListChatRequestAPI$.subscribe((callAPI) => {
            if(callAPI) {
                this.getAllChatRequestIDs();
            }
        });

        // Received Private Message
        // this.wbsocketService.receivePrivateMessage();
    }

    getUserInterationBotResponse(id) {
        const data = {
            message: id
        }

        // First  - Enable / Disabled Analysts 24x7 bot button starts first time
        if(this.userInteractionAPI.length == 0) {
            this.disabledButtonQNABot.firstStepBtn = false;
            this.userInteractionFlow.options.forEach((option) => {
                if (option.id !== id) {
                    option.disabled = true;
                } else {
                    option.disabled = false;
                }
            })
        }
        // First - Enable / Disabled Analysts 24x7 bot button ends first time
       

        if(this.userInteractionAPI.length > 0) {
            this.disabledButtonQNABot.secondStepBtn = false;
        }

        // Second - Enable / Disabled Analysts 24x7 bot button starts from the API
        this.userInteractionAPI.forEach((userInteractionData) => {
            if (userInteractionData.heading !== '') {
              userInteractionData.options.forEach((option) => {
                if (option.id !== id) {
                  option.disabled = true;
                } else {
                  option.disabled = false;
                }
              });
            }
        });
        // Second - Enable / Disabled Analysts 24x7 bot button stops

        this.showTypingLoader = true;

        if(this.userInteractionAPI.length > 0  && this.userInteractionAPI[this.userInteractionAPI.length - 1].sendByUser) {
            this.customerSendPrevChatBot = true;
        } else {
            this.customerSendPrevChatBot = false;
        }
        
        this.shared.getBotResponse(data).subscribe({
            next: async(response) => { 
                const result = JSON.parse(JSON.stringify(response));
                if(result.heading == "") {
                    for(let i = 0; i < result.options.length; i++) {
                        this.userInteractionAPI.push({
                            heading: result.heading,
                            sendByUser: false,
                            flag: result.flag,
                            options: [result.options[i]]
                        });
                    }
                    this.sendChatMessageBtn = result.flag;
                } else {
                    this.sendChatMessageBtn = result.flag;
                    this.userInteractionAPI.push(result);
                }
                
                this.userInteractionLength = Object.keys(this.userInteractionAPI).length;
                this.showTypingLoader = false;
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    getFileDetails(event) {
        console.log("Event:", event);
        this.preUploadScreen(event);
        // Get total file size
        let size = 0;
    
        // Incoming file size
        for(let i = 0; i < event.length; i++) {
            size += event[i].size;
        }
       
        if(size > CONSTANTS.MAX_FILES_SIZE) { // Maximum 15MB you can upload at a time.
            this.customError = CONSTANTS.MAXIMUM_FILE_SIZE_MESSAGE;
            this.fileUploadButtonStatus = true;
            
        } else {
          // Store all the file into Array for iteration
          this.customError = null;
          this.fileUploadButtonStatus = false;
          
          for(let i = 0; i < event.length; i++) {
            event[i]['uploadStatus'] = false;
            this.fileInfo.append('file', event[i]);
          }
          
          // Upload specific file
          this.uploadSpecificFile();
        }
    }

    uploadSpecificFile() {
        var fileData;
        return new Promise((resolve, reject) => {
            for(var [key, fileD] of this.fileInfo.entries()) {
                fileData = fileD;
            }

            // Replace special characters and emojis with underscores
            const sanitizedFileName = fileData.name.replace(/[^\w\d.]+/g, ' ');


            var firstWordFileName = sanitizedFileName.split(' ')[0];
            // Modify the file name - Starts here
         
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
              location: ''
            }

            if(this.userInfo['custom:role'] === "customer") {
                formData.location = "customer-chat-uploads-"+this.fileUploadLocationId;
            } else if(this.userInfo['custom:role'] === "bussiness-analysts") {
                formData.location = "ba-chat-uploads-"+this.fileUploadLocationId;
            } else if(this.userInfo['custom:role'] === "data-analysts") {
                formData.location = "da-chat-uploads-"+this.fileUploadLocationId;
            } else if(this.userInfo['custom:role'] === "admin") {
                formData.location = "admin-chat-uploads-"+this.fileUploadLocationId;
            }
            
            if(fileData.size > CONSTANTS.CHUNK_SIZE) { 
                // Multipart upload
                this.shared.startUpload(formData).subscribe({
                  next: (response) => {
                    const result = JSON.parse(JSON.stringify(response));
                    this.multiPartUpload(result.uploadId, fileData).then((resp) => {
                        return this.completeUpload(result.uploadId, resp);
                    }).then((resp) =>  {
                        console.log("Multipart Upload Parse Data:", resp)
                        this.sendMessage(false, {});
                        resolve(resp);
                    }).catch((err) => {
                        console.error(err);
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
                    
                    if(result.status === 200) {
                      console.log("Success:"+result)
                      this.fileUploadLocation = result.Location;
                      this.sendMessage(false, {});
                    } else {
                        console.log("Not Success:"+result)
                      
                    }
                    resolve(response)
                  },
                  error: (error) => {
                    console.log(error);
                    reject(error);
                  }
                })
              }
        });
    }

    multiPartUpload(uploadId, fileToUpload) {
        return new Promise(async(resolve, reject) => {
          const CHUNKS_COUNT = Math.floor(fileToUpload.size / CONSTANTS.CHUNK_SIZE) + 1;
          let promisesArray = [];
          let params = {};
          let start, end, chunks, blob, file;
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

            if(this.userInfo['custom:role'] === "customer") {
                formData.append('location', "customer-chat-uploads-"+this.fileUploadLocationId);
            } else if(this.userInfo['custom:role'] === "bussiness-analysts") {
                formData.append('location', "ba-chat-uploads-"+this.fileUploadLocationId);
            } else if(this.userInfo['custom:role'] === "data-analysts") {
                formData.append('location', "da-chat-uploads-"+this.fileUploadLocationId);
            } else if(this.userInfo['custom:role'] === "admin") {
                formData.append('location', "admin-chat-uploads-"+this.fileUploadLocationId);
            }

            const logsData = file as File;
            const logsDd = formData.get('data');
            const logsLocation = formData.get('location');

            

            // Calculate the total size of the data
            const totalSize = logsData.size + new Blob([logsDd]).size + new Blob([logsLocation]).size;

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
  
    // sendChunksToServer(formData) {
    //     return new Promise((resolve, reject) => {
    //       this.shared.getPreSignURL(formData).subscribe({
    //         next: (response) => {
    //           const result = JSON.parse(JSON.stringify(response));
    //           resolve(result);
    //         },
    //         error: (error) => {
    //           console.log(error);
    //           reject(error);
    //         }
    //       })
    //     })
    // }
  
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
          location: ""
        }

        if(this.userInfo['custom:role'] === "customer") {
            params.location = "customer-chat-uploads-"+this.fileUploadLocationId;
        } else if(this.userInfo['custom:role'] === "bussiness-analysts") {
            params.location = "ba-chat-uploads-"+this.fileUploadLocationId;
        } else if(this.userInfo['custom:role'] === "data-analysts") {
            params.location = "da-chat-uploads-"+this.fileUploadLocationId;
        } else if(this.userInfo['custom:role'] === "admin") {
            params.location = "admin-chat-uploads-"+this.fileUploadLocationId;
        }

  
        return new Promise((resolve, reject) => {
          this.shared.completeUpload(params).subscribe({
            next: (response) => {
              const data = JSON.parse(JSON.stringify(response));
              console.log("Complete Upload:", response)
              this.fileUploadLocation = data.data.Location;
              resolve(response);
            },
            error: (error) => {
              reject(error);
            }
          })
        })
  
    }

    getAllChatRequestIDs() {
        // Get all the chatRequest Ids
        this.shared.listChatRequestIds().subscribe({
            next: async(response) => {
                this.chatRequestIds = JSON.parse(JSON.stringify(response));
                this.backupChatRequestIds = JSON.parse(JSON.stringify(response));
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    getPrivateChatHistoryDetails() {
        const data = {
            listOfusersId: this.analystsUserIds 
        }
        this.shared.getPersonalChatHistory(data).subscribe({
            next: async(response) => {
                this.allAnalystsChatHistory = JSON.parse(JSON.stringify(response));
                this.isLoadingChat = false;
                
                this.getSelectedUsersChatHistory = this.allAnalystsChatHistory[this.receiverUserId]; 

                // get the unread message count
                for(let analystsId in this.allAnalystsChatHistory) {

                    // Get the send message count

                    // Step 1 check if the last message send by logged in user that mean, all the message has read.
                    const lastMsg = this.allAnalystsChatHistory[analystsId];
                    
                    if(lastMsg.length > 0) {
                        const getTheLastMessage = lastMsg[lastMsg.length - 1];

                        if(getTheLastMessage.senderUserId == this.senderUserId) {
                            this.unreadMessageCountPerUser = 0;
                            this.unreadMessagePerUser[analystsId] = this.unreadMessageCountPerUser;
                        } else {
                            this.unreadMessageCountPerUser = this.allAnalystsChatHistory[analystsId].filter(s => s.status == 'send').length;
                            this.totalUnreadMessageCount += this.unreadMessageCountPerUser;
                            this.unreadMessagePerUser[analystsId] = this.unreadMessageCountPerUser;
                            this.pageTitleChange();
                        }
                    }
                }
                
                // Make it all the read count 0 first, then update the dynamodb database.
                if(this.getSelectedUsersChatHistory) {
                    this.readMessage();
                }
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    getAllOrderChatHistoryDetails() {
        const data = {
            listOfGroupId: this.chatRequestIds.result
        }
        this.shared.getGroupChatHistory(data).subscribe({
            next: async(response) => { 
                this.allGroupChatHistory = JSON.parse(JSON.stringify(response));
                this.isLoadingChat = false;
                
                this.getSelectedGroupChatHistory = this.allGroupChatHistory[this.selectedOrderId]; 

                // get the unread message count
                for(let analystsId in this.allGroupChatHistory) {

                    // Get the send message count

                    // Step 1 check if the last message send by logged in user that mean, all the message has read.
                    const lastMsg = this.allGroupChatHistory[analystsId];
                    
                    if(lastMsg.length > 0) {
                        const getTheLastMessage = lastMsg[lastMsg.length - 1];

                        if(getTheLastMessage.senderUserId == this.senderUserId) {
                            this.unreadMessageCountPerUser = 0;
                            this.unreadMessagePerUser[analystsId] = this.unreadMessageCountPerUser;
                        } else {
                            this.unreadMessageCountPerUser = this.allGroupChatHistory[analystsId].filter(s => s.status == 'send').length;
                            this.totalUnreadMessageCount += this.unreadMessageCountPerUser;
                            this.unreadMessagePerUser[analystsId] = this.unreadMessageCountPerUser;
                            this.pageTitleChange();
                        }
                    }
                }
                
                // Make it all the read count 0 first, then update the dynamodb database.
                if(this.getSelectedGroupChatHistory) {
                    this.readMessage();
                }
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    searchChat(data) {
        if(data == "") {
            this.chatRequestIds = JSON.parse(JSON.stringify(this.backupChatRequestIds));
            this.chatAnalystsInfo = JSON.parse(JSON.stringify(this.backUpchatAnalystsInfo));
        } else {
            // If there is a chatRequest Ids || Can be any type of users
            data = data.toLowerCase();
            if(this.chatRequestIds && this.chatRequestIds.result.length > 0) {
                this.chatRequestIds = JSON.parse(JSON.stringify(this.backupChatRequestIds));
                this.chatRequestIds.result = this.chatRequestIds.result.filter((ss) => {
                    let categoryToLowerCase = ss.category.name.toLowerCase();
                    return categoryToLowerCase.includes(data);
                })
            }

            // If there is an analysts and he / she is not the customer
            if(this.userInfo['custom:role'] != 'customer') {
                this.chatAnalystsInfo = JSON.parse(JSON.stringify(this.backUpchatAnalystsInfo));
                this.chatAnalystsInfo.result.Items = this.chatAnalystsInfo.result.Items.filter((ss) => {
                    let categoryToLowerCase = ss.name.toLowerCase();
                    return categoryToLowerCase.includes(data);
                })
            }
        }

        
    }

    showChat(event) {
        if(event.currentTarget.checked) {
            
            this.showChatPopup = true;
            this.imageName = "../../../assets/img/svg/icons8-close.svg"
            this.imageHeaderMessage = "none";
            let chatIcon = <HTMLElement>document.getElementById('chat-icon');
            chatIcon.style.display = 'none';

        } else {
            let chatIcon = <HTMLElement>document.getElementById('chat-icon');
            chatIcon.style.display = 'block';
            this.showChatPopup = false;
            this.imageName = "../../../assets/img/chat/default-profile.svg";
            this.imageHeaderMessage = "../../../assets/img/chat/chatheader_msg1.svg";
        }
    }

    chatBackGroundImagetUrl() {
        if(this.showChatPopup) {
            return 'url("../../../assets/img/chat/default-profile.svg)'
        } else {
            return "none"
        }
    }

    preUploadScreen(file) {
        const fileDetails = file[0];
        const size = fileDetails.size;
        const fileName = fileDetails.name;
        const fileType = fileDetails.name.split(".").pop();
        const preUpload = {
            fileName: fileName,
            fileType: fileType,
            fileSize: size,
        }
        this.sendMessage(true, preUpload) 
    }

    sendMessage(flag, preUploadFile) {
        const regex = /^\s*$/; // If string contains only "\n" do nothing.
        
        if(!flag) {
            this.messageBody = this.fileUploadLocation;
            var fileName = this.messageBody.split('/');
            fileName = decodeURI(fileName.pop());
            var fileExtention = fileName.split(".")[1];
        } 

        if(Object.keys(preUploadFile).length > 0) {
            this.preUploadFileStatus = true;

            const preUploadFileObject = {
                fileAttachment: true,
                fileAttachmentPreUpload: true,
                senderUserId: this.userInfo['cognito:username'],
                senderEmailId: this.userInfo.email,
                senderName: this.userInfo['custom:name'],
                fileName: preUploadFile.fileName,
                fileExtention: preUploadFile.fileType
            }
            
            
            // this.allAnalystsChatHistory[this.receiverUserId] = this.getSelectedUsersChatHistory;

            if(!this.isGroupChatSelected) { // private message
                this.getSelectedUsersChatHistory.push(preUploadFileObject);
                this.allAnalystsChatHistory[this.receiverUserId] = this.getSelectedUsersChatHistory;
            } else { // Group message
                this.getSelectedGroupChatHistory.push(preUploadFileObject);
                this.allGroupChatHistory[this.selectedOrderId] = this.getSelectedGroupChatHistory;
            }

        } else {
            if (!regex.test(this.messageBody)) {
                // With storing database, using AWS SQS
                if(!this.isGroupChatSelected && !this.userInteraction) { // Private message
                    let sendPrivateMessage = {
                        action: "sendprivate_msg",
                        message: {
                            privateMessage: true,
                            body: {
                                senderUserId: this.userInfo['cognito:username'],
                                senderEmailId: this.userInfo.email,
                                senderName: this.userInfo['custom:name'],
                                messageBody: this.messageBody,
                                receiverUserName: this.receiverUserName,
                                receiverUserEmail: this.receiverUserEmail,
                                fileAttachment: flag === false ? true : false,
                                // fileAttachmentPreUpload: flag === false ? true : false,
                                receiverUserId: this.receiverUserId,
                                messageType: 'private',
                                status: 'send', // send/received/read
                            }
                        }
                    }

                    // Step 1 - Check if there is a file
                    // Step 2 - Iterate all the data in the array
                    // Step 3 - Remove the loading file to uploaded file
                    let loadingFileIndex = -1;
                    if(!flag) {
                        this.preUploadFileStatus = false;
                        this.getSelectedUsersChatHistory.forEach((x, index) => {
                            if(x.fileAttachmentPreUpload) { 
                                loadingFileIndex = index 
                            }
                        })

                        // If it is found
                        if(loadingFileIndex > -1) {
                            this.getSelectedUsersChatHistory[loadingFileIndex] = {
                                senderEmailId: this.userInfo.email,
                                stage: "production",
                                receiverUserId: this.receiverUserId,
                                messageType: "private",
                                status: "send",
                                fileAttachment: flag === false ? true : false,
                                fileName: flag === false ? fileName: null,
                                fileExtention: flag === false ? fileExtention: null,
                                // fileAttachmentPreUpload: flag === false ? true : false,
                                receiverUserEmail: this.receiverUserEmail,
                                time: Date.now(),
                                receiverUserName: this.receiverUserName,
                                messageBody: this.messageBody,
                                senderName: this.userInfo['custom:name'],
                                senderUserId: this.userInfo['cognito:username']
                            }
                        }
                    } else {
                        this.getSelectedUsersChatHistory.push({
                            senderEmailId: this.userInfo.email,
                            stage: "production",
                            receiverUserId: this.receiverUserId,
                            messageType: "private",
                            status: "send",
                            fileAttachment: flag === false ? true : false,
                            fileName: flag === false ? fileName: null,
                            fileExtention: flag === false ? fileExtention: null,
                            // fileAttachmentPreUpload: flag === false ? true : false,
                            receiverUserEmail: this.receiverUserEmail,
                            time: Date.now(),
                            receiverUserName: this.receiverUserName,
                            messageBody: this.messageBody,
                            senderName: this.userInfo['custom:name'],
                            senderUserId: this.userInfo['cognito:username']
                        });
                    }
        
                    this.allAnalystsChatHistory[this.receiverUserId] = this.getSelectedUsersChatHistory;
        
                    this.messageBody = "";
        
                    // Without storing database, and No AWS SQS used here
        
                    // let sendPrivateMessage = {
                    //     action: "sendprivate",
                    //     message: this.messageBody,
                    //     to: this.currentUserEmail,
                    // }
                    this.scrollToBottom();
                    this.wbsocketService.send(sendPrivateMessage);
                } else if(this.isGroupChatSelected && !this.userInteraction) { // Group message
                    let sendGroupMessage = {
                        action: "sendgroup_msg",
                        message: {
                            privateMessage: false,
                            body: {
                                senderUserId: this.userInfo['cognito:username'],
                                senderEmailId: this.userInfo.email,
                                senderName: this.userInfo['custom:name'],
                                senderProfilePic: this.userInfo['custom:profileurl'],
                                role: this.userInfo['custom:role'],
                                messageBody: this.messageBody,
                                roomId: this.chatHeader,
                                fileAttachment: flag === false ? true : false,
                                // fileAttachmentPreUpload: flag === false ? true : false,
                                messageType: 'group',
                                status: {
                                    customer: this.userInfo['custom:role'] === "customer" ? 'read': 'send',
                                    data_analysts: this.userInfo['custom:role'] === "data-analysts" ? 'read': 'send',
                                    bussiness_analysts: this.userInfo['custom:role'] === "bussiness-analysts" ? 'read': 'send',
                                    admin: this.userInfo['custom:role'] === "admin" ? 'read': 'send',
                                },
                            }
                        }
                    }
    
                    
                    if(!this.getSelectedGroupChatHistory) {
                        this.getSelectedGroupChatHistory = [];
                    }

                    // Step 1 - Check if there is a file
                    // Step 2 - Iterate all the data in the array
                    // Step 3 - Remove the loading file to uploaded file
                    let loadingFileIndex = -1;
                    if(!flag) {
                        this.preUploadFileStatus = false;
                        this.getSelectedGroupChatHistory.forEach((x, index) => {
                            if(x.fileAttachmentPreUpload) { 
                                loadingFileIndex = index 
                            }
                        })

                        // If it is found
                        if(loadingFileIndex > -1) {
                            this.getSelectedGroupChatHistory[loadingFileIndex] = {
                                senderEmailId: this.userInfo.email,
                                stage: "production",
                                receiverUserId: this.receiverUserId,
                                messageType: "group",
                                status: {
                                    customer: this.userInfo['custom:role'] === "customer" ? 'read': 'send',
                                    data_analysts: this.userInfo['custom:role'] === "data-analysts" ? 'read': 'send',
                                    bussiness_analysts: this.userInfo['custom:role'] === "bussiness-analysts" ? 'read': 'send',
                                    admin: this.userInfo['custom:role'] === "admin" ? 'read': 'send',
                                },
                                receiverUserEmail: this.receiverUserEmail,
                                time: Date.now(),
                                fileAttachment: flag === false ? true : false,
                                fileName: flag === false ? fileName: null,
                                fileExtention: flag === false ? fileExtention: null,
                                // fileAttachmentPreUpload: flag === false ? true : false,
                                receiverUserName: this.receiverUserName,
                                messageBody: this.messageBody,
                                senderName: this.userInfo['custom:name'],
                                senderUserId: this.userInfo['cognito:username']
                            }
                        }
                    } else {
                        this.getSelectedGroupChatHistory.push({
                            senderEmailId: this.userInfo.email,
                            stage: "production",
                            receiverUserId: this.receiverUserId,
                            messageType: "group",
                            status: {
                                customer: this.userInfo['custom:role'] === "customer" ? 'read': 'send',
                                data_analysts: this.userInfo['custom:role'] === "data-analysts" ? 'read': 'send',
                                bussiness_analysts: this.userInfo['custom:role'] === "bussiness-analysts" ? 'read': 'send',
                                admin: this.userInfo['custom:role'] === "admin" ? 'read': 'send',
                            },
                            receiverUserEmail: this.receiverUserEmail,
                            time: Date.now(),
                            fileAttachment: flag === false ? true : false,
                            fileName: flag === false ? fileName: null,
                            fileExtention: flag === false ? fileExtention: null,
                            // fileAttachmentPreUpload: flag === false ? true : false,
                            receiverUserName: this.receiverUserName,
                            messageBody: this.messageBody,
                            senderName: this.userInfo['custom:name'],
                            senderUserId: this.userInfo['cognito:username']
                        });   
                    }
    
                    this.allGroupChatHistory[this.selectedOrderId] = this.getSelectedGroupChatHistory;
    
                    this.messageBody = "";
                    this.scrollToBottom();
                    this.wbsocketService.send(sendGroupMessage);
                } else if(this.userInteraction) { // From Analysts 24x7 Bot
                    // this.userInteractionCustomerReply = {
                    //     content: this.messageBody,
                    //     flag: false
                    // }
                    
                    this.userInteractionAPI.push({
                        heading: "",
                        flag: false,
                        sendByUser: true,
                        options: [
                            {
                                content: this.messageBody,
                                contentType: "PlainText"
                            }
                        ]
                    });
                    this.getUserInterationBotResponse(this.messageBody);
                    this.messageBody = "";
                }
            }
        }

    }


    analysts24x7ChatBot() {
        this.scrollToBottom();
        this.userInteraction = true;
        this.showOrderIdText = false;
        this.showWelcomeMessage = false;
        this.dynamicClassSelection = true;
        this.sendChatMessageBtn = true;
        this.preUploadFileStatus = true;
        this.profileUrl = this.logo;
        this.chatHeader = 'Analysts24x7';
        this.chatInfo = 'Ask me anything';


        // Add/Remove class logic  
        this.addRemoveDynamicClass(0);
        this.scrollToBottom(); 
    }

    getChatHistory(index, data, isAnalysts) {
        this.scrollToBottom();
        this.showWelcomeMessage = false;
        this.dynamicClassSelection = true;

        // console.log("Get Chat History:", index, data, isAnalysts);
        // console.log("Get allAnalystsChatHistory:", this.allAnalystsChatHistory);
        // console.log("Get allGroupChatHistory:", this.allGroupChatHistory);
        // Get Analysts Chat Details
        if(isAnalysts) {
            this.chatHeader = data.name;
            this.chatInfo = data.role;
            this.profileUrl = data.profileUrl;
            this.receiverUserId = data.id;
            this.receiverUserEmail = data.email;
            this.receiverUserName = data.name;
            this.userInteraction = false;
            this.isAnalysts = true;
            this.preUploadFileStatus = false;
            this.showOrderIdText = false;
            this.isGroupChatSelected = false;
            this.sendChatMessageBtn = false;
           
            if(!this.allAnalystsChatHistory) {
                this.isLoadingChat = true;
            } else {
                this.getSelectedUsersChatHistory = this.allAnalystsChatHistory[data.id];
                
                // Make it all the read count 0 first, then update the dynamodb database.
                this.readMessage();
            }
            
        } else {
            // Get Customer Order ids chat details
            this.chatHeader = data.id;
            this.chatInfo = data.category.name;
            this.selectedOrderId = data.id;
            this.profileUrl = this.ordersImage;
            this.showOrderIdText = true;
            this.isGroupChatSelected = true;
            this.isAnalysts = false;
            this.preUploadFileStatus = false;
            this.userInteraction = false;
            this.sendChatMessageBtn = false;
            // receiverUserId
           if(!this.allGroupChatHistory) {
                this.isLoadingChat = true;
            } else {
                this.getSelectedGroupChatHistory = this.allGroupChatHistory[data.id];
                
                if(this.getSelectedGroupChatHistory) {
                    this.readMessage();
                }
                // Make it all the read count 0 first, then update the dynamodb database.
               
            }
        }

        this.scrollToBottom();
        // Add/Remove class logic  
        this.addRemoveDynamicClass(index);
        
    }

    downloadFile(fileLink) {
        const getFileName = fileLink.split("/");
        const fileName = getFileName.pop();

        const downloadWindow = window.open('', '_blank');
        downloadWindow.document.write('<p>Your download will start shortly...</p>');

        // Set the title and favicon for the new tab
        downloadWindow.document.title = 'Analysts24x7';
        const favicon = downloadWindow.document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = 'https://dashboard.analysts24x7.com/assets/img/logo/apple-icon.png';
        downloadWindow.document.head.appendChild(favicon);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', fileLink, true);
        xhr.responseType = 'blob';

        xhr.onload = () => {
            if (xhr.status === 200) {
                const blob = new Blob([xhr.response], { type: xhr.getResponseHeader('content-type') });
                const downloadUrl = URL.createObjectURL(blob);

                const anchor = document.createElement('a');
                anchor.href = downloadUrl;
                anchor.download = fileName;

                // Attach the anchor to the new window's document
                downloadWindow.document.body.appendChild(anchor);

                // Programmatically click the anchor to trigger the download
                const clickEvent = new MouseEvent('click');
                anchor.dispatchEvent(clickEvent);

                // Clean up the temporary URL and anchor
                URL.revokeObjectURL(downloadUrl);
                anchor.remove();

                // Close the new window after a brief delay (optional)
                setTimeout(() => downloadWindow.close(), 2000);
            } else {
                downloadWindow.document.write(`<p>Failed to download the file. Status: ${xhr.status}</p>`);
                setTimeout(() => downloadWindow.close(), 3000); // Close the window after 3 seconds if the download fails
            }
        };
        xhr.send();
    }

    readMessage() {
        
        if(this.isAnalysts) {
            console.log("IsAnalysts ReadMessage:", this.isAnalysts);
            console.log(this.totalUnreadMessageCount, this.unreadMessagePerUser, this.receiverUserId);

            // Once he read, first update the client side.
            this.totalUnreadMessageCount = this.totalUnreadMessageCount - this.unreadMessagePerUser[this.receiverUserId];
                    
            this.unreadMessagePerUser[this.receiverUserId] = 0;

            // Step 1 - Remove the logged in user message, Because he is sending it
            var afterRemovingLoggedUserMsg = this.allAnalystsChatHistory[this.receiverUserId].filter(s => s.senderUserId != this.senderUserId && s.id);
            console.log("afterRemovingLoggedUserMsg:", afterRemovingLoggedUserMsg)
            // Step 2 - Get all the unread message
            var getUnreadMessage = afterRemovingLoggedUserMsg.filter(s => s.status == 'send');
            console.log("getUnreadMessage:", getUnreadMessage)
            console.log("allAnalystsChatHistory:", this.allAnalystsChatHistory)
            // Once its updated the database, we need to also update in the client side
            this.allAnalystsChatHistory[this.receiverUserId] = this.allAnalystsChatHistory[this.receiverUserId].map((e1) => {
                e1.status = "read";
                return e1;
            });

            if(getUnreadMessage.length > 0) {
                let readMessage = {
                    action: "read_msg",
                    message: {
                        readMessage: true,
                        type: 'private',
                        body: getUnreadMessage
                    }
                }
                this.wbsocketService.send(readMessage);
            }
        } else {
            
            // Once he read, first update the client side.
            this.totalUnreadMessageCount = this.totalUnreadMessageCount - this.unreadMessagePerUser[this.selectedOrderId];
                    
            this.unreadMessagePerUser[this.selectedOrderId] = 0;

            // Step 1 - Remove the logged in user message, Because he is sending it
            var afterRemovingLoggedUserMsg = this.allGroupChatHistory[this.selectedOrderId].filter(s => s.senderUserId != this.senderUserId && s.id);

            // Step 2 - Get all the unread message
            // var getUnreadMessage = afterRemovingLoggedUserMsg.filter(s => s.status == 'send');

            var getUnreadMessage;

            if(this.userInfo['custom:role'] === "customer") {
                getUnreadMessage = afterRemovingLoggedUserMsg.filter(s => s.status.customer == 'send');
                this.allGroupChatHistory[this.selectedOrderId] = this.allGroupChatHistory[this.selectedOrderId].map((e1) => {
                    e1.status.customer = "read";
                    return e1;
                });   
            } if(this.userInfo['custom:role'] === "bussiness-analysts") {
                getUnreadMessage = afterRemovingLoggedUserMsg.filter(s => s.status.bussiness_analysts == 'send');
                this.allGroupChatHistory[this.selectedOrderId] = this.allGroupChatHistory[this.selectedOrderId].map((e1) => {
                    e1.status.bussiness_analysts = "read";
                    return e1;
                });   
            } if(this.userInfo['custom:role'] === "data-analysts") {
                getUnreadMessage = afterRemovingLoggedUserMsg.filter(s => s.status.data_analysts == 'send');
                this.allGroupChatHistory[this.selectedOrderId] = this.allGroupChatHistory[this.selectedOrderId].map((e1) => {
                    e1.status.data_analysts = "read";
                    return e1;
                });   
            } if(this.userInfo['custom:role'] === "admin") {
                getUnreadMessage = afterRemovingLoggedUserMsg.filter(s => s.status.admin == 'send');
                this.allGroupChatHistory[this.selectedOrderId] = this.allGroupChatHistory[this.selectedOrderId].map((e1) => {
                    e1.status.admin = "read";
                    return e1;
                });    
            }
         

            // Once its updated the database, we need to also update in the client side
            
            if(getUnreadMessage.length > 0) {
                let readMessage = {
                    action: "read_msg",
                    message: {
                        readMessage: true,
                        type: 'group',
                        body: getUnreadMessage
                    }
                }
                this.wbsocketService.send(readMessage);
            }
        }
        
        this.pageTitleChange();
    }

    addRemoveDynamicClass(index) {

        // Remove class logic 
        let dynamicClassMedia = document.querySelectorAll("[class*=widget-list-media-]"); 
        
        if(dynamicClassMedia.length > 0) {
            for (var i = 0; i < dynamicClassMedia.length; i++) {
                dynamicClassMedia[i].classList.remove('widget-list-item-selected');
            }
        }

        let dynamicClassContent = document.querySelectorAll("[class*=widget-list-content-"); 
        
        if(dynamicClassContent.length > 0) {
            for (var i = 0; i < dynamicClassContent.length; i++) {
                dynamicClassContent[i].classList.remove('widget-list-item-selected');
            }
        }

        // Add class

        var widgetListMedia = document.getElementsByClassName('widget-list-media-'+index);
        var widgetListContent = document.getElementsByClassName('widget-list-content-'+index);

        // Add WidgetList Media
        for (var i = 0; i < widgetListMedia.length; i++) {
            widgetListMedia[i].classList.add('widget-list-item-selected');
        }

        // Add WidgetList Content
        for (var i = 0; i < widgetListContent.length; i++) {
            widgetListContent[i].classList.add('widget-list-item-selected');
        }
    }

    playAudio() {
        return new Promise((resolve, reject) => {
            var constantFile = this.constants;
            // If the user has selected that window and chat is open state - Then he will read it, and call the read method
            let audio = new Audio();
            audio.preload = "auto";                      // intend to play through
            audio.autoplay = true;                       // autoplay when loaded
            audio.onerror = reject;                      // on error, reject
            audio.onended = resolve;                     // when done, resolve

            audio.src = constantFile.NEW_MESSAGE_SOUND;
            // audio.load();
            // audio.play();  
        })
    }

    pageTitleChange() {
        // Each and every time I set the interval I should clear it first, else it won't stop
        if(this.totalUnreadMessageCount) {
            clearInterval(this.setIntervalTime);
            if(this.totalUnreadMessageCount == 0) {
                document.title = "Analyst24 X 7";
                clearInterval(this.setIntervalTime);
            } else {
                var i = 0;
                const newTitle =  this.totalUnreadMessageCount + " new message";
                const retryLoop = () => {
                    var titles=[newTitle, 'Analyst24 X 7'];//add more titles if you want
                    if(i === titles.length) {
                        i = 0;
                    }
                    document.title = titles[i];
                    i++;
                };
                this.setIntervalTime = setInterval(retryLoop, 3000)
            }
        } else {
            clearInterval(this.setIntervalTime);
        }
    }

    scrollToBottom() {
        // scroll-to-bottom
        // const element = document.getElementById("scroll-to-bottom");
        // element.scrollIntoView({ behavior: "smooth", block: "end" });
        $(".ps--active-y").animate({ scrollTop: 20000000 }, "fast"); 
    }

    addReaction() {
        if(this.showEmoji) {
			this.showEmoji = false;
		} else {
			this.showEmoji = true;
		}
    }

    addEmoji(event) {
        this.showEmoji = false;	
        if(this.messageBody) {
            this.messageBody += event.emoji.native;
        } else {
            this.messageBody = event.emoji.native;
        }
       
    }

    // Format the date by saying today, yesterday and other date in dd/mm/yyyy format
    formatDate(timestamp: number) {
        const currentDate = new Date();
        const yesterdayDate = new Date(currentDate);
        yesterdayDate.setDate(currentDate.getDate() - 1);
        
        const dataDate = new Date(timestamp);
        
        if (
            dataDate.getDate() === currentDate.getDate() &&
            dataDate.getMonth() === currentDate.getMonth() &&
            dataDate.getFullYear() === currentDate.getFullYear()
        ) {
            return 'Today';
        } else if (
            dataDate.getDate() === yesterdayDate.getDate() &&
            dataDate.getMonth() === yesterdayDate.getMonth() &&
            dataDate.getFullYear() === yesterdayDate.getFullYear()
        ) {
            return 'Yesterday';
        } else {
            const day = ('0' + dataDate.getDate()).slice(-2);
            const month = ('0' + (dataDate.getMonth() + 1)).slice(-2);
            const year = String(dataDate.getFullYear());
            return `${day}/${month}/${year}`;
        }
    }  

    // If any date is repeating, then don't show that date.
    areDatesEqual(date1: Date, date2: Date): boolean {
        return (
          date1.getDate() === date2.getDate() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
        );
      }
    
      shouldShowDate(current, previous, index: number): boolean {
        let currentDate = current.time;
        let previousDate = previous.time;
        if (index === 0) {
          return true; // The first date should always be shown
        }
    
        const currentFormattedDate = new Date(currentDate);
        const previousFormattedDate = new Date(previousDate);
    
        return !this.areDatesEqual(currentFormattedDate, previousFormattedDate);
    }
 }
