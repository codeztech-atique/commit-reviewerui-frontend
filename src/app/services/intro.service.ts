import { Injectable, QueryList, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import * as introJs from 'intro.js/intro.js';
import { ROLES } from '../config/roles';


interface IntroStep {
  element: ElementRef | string;
  intro: string;
  position?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class IntroService implements AfterViewInit {
  @ViewChildren('introElement') introElements: QueryList<ElementRef>;
  
  userDetails = JSON.parse(localStorage.getItem('currentUser'));

  private steps: IntroStep[] = [
  ];

  constructor() {
    if(this.userDetails && this.userDetails['custom:role'] == ROLES.CUSTOMER) {
       this.steps = [];
       this.steps.push({ element: 'app-content', intro: 'Welcome to Analysts24x7! 🌟 Ready to simplify your tasks? Let me show you around!' }); 
       this.steps.push({ element: '#step1', intro: '👉 Ready to get started? Click the "Upload" button and select the file you need assistance with.', position: 'bottom', title: 'Step 1' });
       this.steps.push({ element: '#step2', intro: '📅 Stay informed! View your subscription details including start and end dates, and available balance in hours. Feel free to reach out if you have any questions!', position: 'bottom', title: 'Step 2' });
       this.steps.push({ element: '#step3', intro: '📁 Upload your files here! Choose between Quick Request (delivered within a day) or Project Request (exclusive for Enterprise users, delivered within 7 days or more). Let us handle the rest!', position: 'bottom', title: 'Step 3' });
       this.steps.push({ element: '#step4', intro: '📊 Check out your progress! View the total number of uploads you\'ve made since your registration date. Stay updated on your accomplishments!', position: 'bottom', title: 'Step 4' });
       this.steps.push({ element: '#step5', intro: '🕵️‍♂️ Dive into the details! Under "Work," you can view the completed tasks, including information on when the work was completed and how long it took. Get a comprehensive overview of your completed requests!', position: 'bottom', title: 'Step 5' });
       this.steps.push({ element: '#step6', intro: '🏁 Explore the results! See the total number of completed works by our analysts. Get insights into the successful outcomes of your requests!', position: 'bottom', title: 'Step 6' });
       this.steps.push({ element: '#chat-btn', intro: '🤖 Meet your intelligent assistant! Our bot is here to assist you. After making a request, enjoy real-time communication with our analysts. You can also send attachments, just make sure each upload is less than 15 MB.', position: 'bottom-right', title: 'Step 7' });
       this.steps.push({ element: '#step8', intro: '⏰ Time for an upgrade! If you\'ve used up all your allocated hours, consider upgrading your plan to continue receiving uninterrupted support. We\'re here to help you every step of the way!', position: 'bottom', title: 'Step 8' });
      //  this.steps.push({ element: '#step9', intro: '⚙️ Explore additional settings! Customize your experience by changing the color theme, toggling between light and dark mode, and more. Make it your own!', position: 'bottom-left', title: 'Step 9' });
    } else if(this.userDetails && this.userDetails['custom:role'] == ROLES.BUSSNESS_ANALYSTS) {
        this.steps = [];
        this.steps.push({ element: 'app-content', intro: 'Welcome to Analysts24x7! 🌟 As a Business Analyst, your journey begins here. Let\'s explore the tools and features tailored to meet your analytical needs. Follow the steps below to navigate through the platform and make the most out of your experience.' }); 
        this.steps.push({ element: '#step1', intro: '🚀 Begin by identifying tasks. For customer accounts (Freemium, Base, Pro), accept or reject work. For Enterprise users, determine if it\'s a project or quick request. Make calls accordingly. Assign project requests to data analysts, monitor ongoing tasks, and review completed work. Accept or reject, initiating a feedback loop if necessary.', position: 'bottom', title: 'Step 1' });
        this.steps.push({ element: '#step2', intro: '⏰ Estimate task completion time and communicate with the customer to understand requirements. If a task is not feasible for the system, consider rejecting the work.', position: 'bottom', title: 'Step 2' });
        this.steps.push({ element: '#step3', intro: '👀 Monitor the progress of data analysts working on project requests from enterprise users. Communicate with them and ensure timely completion of the tasks.', position: 'bottom', title: 'Step 3' });
        this.steps.push({ element: '#step4', intro: '🔍 Review the work completed by data analysts, specifically for project requests from enterprise users. After the review, choose to accept the work or reject it. Accepted work proceeds to the customer for another review round, while rejected work returns to data analysts for further modification.', position: 'bottom', title: 'Step 4' });
        this.steps.push({ element: '#step5', intro: '🕵️‍♂️ Explore "My Work" section to manage tasks. Accept or reject customer work, applicable to all account types (Freemium, Base, Pro & Enterprise) for quick requests. Accepted tasks move to "Ongoing Work." Once completed and reviewed by the customer, find them under "Completed Work". Rejected tasks can be found under the "Rejected Work" section.', position: 'bottom', title: 'Step 5' });
        this.steps.push({ element: '#step6', intro: '⌛ For quick requests, set the estimated timeline for work completion. Find these tasks under the "Ongoing Work" section.', position: 'bottom', title: 'Step 6' });
        this.steps.push({ element: '#step7', intro: '🔍 After submitting ongoing work, it will be assigned to the customer for review. Once reviewed, you can track the work in the "Completed Work" section. The total number indicates the successfully completed tasks.', position: 'bottom', title: 'Step 7' });
        this.steps.push({ element: '#step8', intro: '🗑️ If you decide to reject a task during the identification phase, you can find that work under the "Rejected Work" section.', position: 'bottom', title: 'Step 8' });
        this.steps.push({ element: '#chat-btn', intro: '🤖 Meet your intelligent assistant! Our bot is here to assist you. After making a request, enjoy real-time communication with customers & analysts. You can also send attachments, just make sure each upload is less than 15 MB.', position: 'bottom-right', title: 'Step 9' });
        this.steps.push({ element: '#step9', intro: '📊 In the "My Work" section, view the total number of open orders. This includes orders that are currently in the open state and require attention.', position: 'bottom', title: 'Step 10' });
        this.steps.push({ element: '#step10', intro: '📊 View the total number of open orders in the "My Work" section. This encompasses orders that are currently in the open state, awaiting completion or review.', position: 'bottom', title: 'Step 11' });
        this.steps.push({ element: '#step11', intro: '📊 View the total number of closed orders. These orders have been successfully completed and closed by you.', position: 'bottom', title: 'Step 12' });
    } else if(this.userDetails && this.userDetails['custom:role'] == ROLES.DATA_ANALYSTS) {
        this.steps = [];
        this.steps.push({ element: 'app-content', intro: 'Welcome to Analysts24x7! 🌟 As a Data Analyst, your journey begins here. Let\'s explore the tools and features tailored to meet your analytical needs. Follow the steps below to navigate through the platform and make the most out of your experience.' }); 
        this.steps.push({ element: '#step1', intro: '👀 Under pending tasks, project requests are assigned to you for our enterprise customers. Understand the task, personally communicate with business analysts via our chat application or initiate a conversation via group. Then, accept the work.', position: 'bottom', title: 'Step 1' });
        this.steps.push({ element: '#step2', intro: '📊 View the total number of ongoing orders in the "Ongoing Task" section. This encompasses orders that are currently in the open state, awaiting completion or review.', position: 'bottom', title: 'Step 2' });
        this.steps.push({ element: '#chat-btn', intro: '🤖 Meet your intelligent assistant! Our bot is here to assist you. After making a request, enjoy real-time communication with customers & analysts. You can also send attachments, just make sure each upload is less than 15 MB.', position: 'bottom-right', title: 'Step 3' });
        this.steps.push({ element: '#step3', intro: '📊 View the total number of complete orders. These orders have been successfully completed and closed by you.', position: 'bottom', title: 'Step 4' });
    } else if(this.userDetails && this.userDetails['custom:role'] == ROLES.ADMIN) { // He is a admin
        this.steps = [];
        this.steps.push({ element: 'app-content', intro: 'Welcome to the web let me show you around!' }); 
        this.steps.push({ element: '#step1', intro: 'Step 1!', position: 'bottom' });
        this.steps.push({ element: '#step2', intro: 'Step 1!', position: 'bottom' });
        this.steps.push({ element: '#step3', intro: 'Step 1!', position: 'bottom' });
        this.steps.push({ element: '#step4', intro: 'Step 1!', position: 'bottom' });
        this.steps.push({ element: '#step5', intro: 'Step 1!', position: 'bottom' });
        this.steps.push({ element: '#step6', intro: 'Step 1!', position: 'bottom' });
        this.steps.push({ element: '#step7', intro: 'Step 1!', position: 'bottom' });
        this.steps.push({ element: '#step8', intro: 'Step 1!', position: 'bottom' });
        this.steps.push({ element: '#step8', intro: 'Step 1!', position: 'bottom' });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.introElements.forEach((element, index) => {
        this.steps.push({
          element: element,
          intro: `Step ${index + 1}!`,
          position: 'right',
        });
      });
    }, 0);
  }

  addStep(elementId: string, introText: string, position: string): void {
    this.steps.push({
      element: elementId,
      intro: introText,
      position: position,
    });
  }

  startIntro(): void {
    const intro = introJs().setOptions({
      tooltipClass: 'customTooltip',
      highlightClass: 'customHighlight',
      exitOnOverlayClick: false,
      disableInteraction: false,
      steps: this.steps,
      hidePrev: false,
      hideNext: false,
    });

    

    // Using onbeforechange callback to update steps before each step is shown
    intro.onbeforechange((targetElement) => {
      // Get the index of the current step
      const currentIndex = this.steps.findIndex(step => step.element === targetElement.id);
      
      // Update the current step dynamically
      if (currentIndex !== -1) {
       
        // // Use a slight delay to allow for proper rendering
        // const customContent = `
        //     <div class="customTooltip">
        //         <h3>${this.steps[currentIndex].header}</h3>
        //         <p>Step ${currentIndex + 1}: ${this.steps[currentIndex].intro}</p>
        //     </div>`;

        // intro.addStep({
        //     element: targetElement,
        //     intro: customContent,
        //     position: 'right',
        // });
        const currentIndex = this.steps.findIndex(step => step.element === targetElement.id);
  
            // Update the current step dynamically
            if (currentIndex !== -1) {
                const customContent = `
                    <h1>${this.steps[currentIndex].title}</h1>
                    <p>Step ${currentIndex + 1}: ${this.steps[currentIndex].intro}</p>`;

                // Manually set the content within the tooltip title
                targetElement.querySelector('.introjs-tooltip-title').innerHTML = customContent;
            }

      }
    });

    intro.start();
  }
}
