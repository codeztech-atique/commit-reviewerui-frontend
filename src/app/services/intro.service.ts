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
        this.steps.push({
          element: 'app-content',
          intro: 'Welcome to Zoom Codeguard! 🌟 Explore how we can streamline your GitHub workflow by automatically reviewing your code and managing pull requests from development to master branches. Get ready to enhance your productivity and code quality without the hassle!',
          title: 'Welcome'
        });
        this.steps.push({
          element: '#step1',
          intro: '👉 Here’s a list of all the GitHub accounts you’ve imported. This overview helps you manage multiple accounts more effectively.',
          position: 'bottom',
          title: 'Step 1: Your GitHub Accounts'
        });
        this.steps.push({
            element: '#step2',
            intro: '📁 Next, see all the repositories you have configured with Zoom Codeguard AI bot for automated code reviews. Adjust settings as needed right here!',
            position: 'bottom',
            title: 'Step 2: Configured Repositories'
        });
        this.steps.push({
            element: '#step3',
            intro: '📊 Track your activity with a total count of commits made across all accounts and repositories. This helps you monitor your coding contributions over time.',
            position: 'bottom',
            title: 'Step 3: Commit Overview'
        });
        this.steps.push({
            element: '#step4',
            intro: '🌟 Finally, review all approved PRs. This section lets you see the impact of your code and track progress on projects.',
            position: 'bottom',
            title: 'Step 4: Approved Pull Requests'
        });
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
