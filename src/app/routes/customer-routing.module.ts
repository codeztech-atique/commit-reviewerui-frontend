// Customer Routing Module 

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditProfile } from '../layouts/edit-profile/edit-profile.component';

// Import other customer components here

// Customer Components

// Customer Dashboard
import { Customer_Dashboard } from '../components/customer/dashboard/dashboard';

// Customer Upload
import { Customer_FileUpload } from '../components/customer/files/file-upload/file-upload';
import { Customer_QuickRequest_List } from '../components/customer/files/quick-request/quick-request';
import { Customer_ProjectRequest_List } from '../components/customer/files/project-request/project-request';
import { Customer_TaskDetails } from '../components/customer/files/task-details/task-details';

// Customer Work
import { Customer_ReviewWork } from '../components/customer/work/review-work/review-work';
import { Customer_ReviewWorkDetails } from '../components/customer/work/review-work-details/review-work-details';
import { Customer_CompletedWork } from '../components/customer/work/complete-work/complete-work';
import { Customer_CompletedWorkDetails } from '../components/customer/work/completed-work-details/completed-work-details';

// Customer Balance
import { Customer_AddCredit } from '../components/customer/balance/add-credit/add-credit';
import { Customer_ListTransaction } from '../components/customer/balance/list-transaction/list-transaction';
import { Customer_ManageCard } from '../components/customer/balance/manage-card/manage-card';

// Customer Issues
import { Customer_CreateIssue } from '../components/customer/issues/create-issue/create-issue';
import { Customer_OpenIssue } from '../components/customer/issues/open-issue/open-issue';
import { Customer_CloseIssue } from '../components/customer/issues/close-issue/close-issue';


const customerRoutes: Routes = [
  // Customer routes
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'edit-profile', component: EditProfile, data: { title: 'Edit profile', role: 'customer' } },

  { path: 'dashboard', component: Customer_Dashboard, data: { title: 'Dashboard', role: 'customer' } },

  { path: 'file/upload', component: Customer_FileUpload, data: { title: 'Upload File', role: 'customer' } },
  { path: 'task/quick-request/list', component: Customer_QuickRequest_List, data: { title: 'List Quick Request', role: 'customer' } },
  { path: 'task/project-request/list', component: Customer_ProjectRequest_List, data: { title: 'List Project Request', role: 'customer' } },
  
  { path: 'task/:id/details', component: Customer_TaskDetails, data: { title: 'Task Details', role: 'customer' } },

  { path: 'review/work', component: Customer_ReviewWork, data: { title: 'Review Work', role: 'customer' } },
  { path: 'review/work/:id/details', component: Customer_ReviewWorkDetails, data: { title: 'Review Work Details', role: 'customer' } },
  { path: 'completed/work', component: Customer_CompletedWork, data: { title: 'Completed Work', role: 'customer' } },
  { path: 'completed/work/:id/details', component: Customer_CompletedWorkDetails, data: { title: 'Completed Work Details', role: 'customer' } },

  { path: 'balance/add-credit', component: Customer_AddCredit, data: { title: 'Add Credit', role: 'customer' } },
  { path: 'balance/list-transaction', component: Customer_ListTransaction, data: { title: 'List transaction', role: 'customer' } },
  { path: 'balance/manage-card', component: Customer_ManageCard, data: { title: 'Balance Card', role: 'customer' } },

  { path: 'issues/create-issue', component: Customer_CreateIssue, data: { title: 'Create Issue', role: 'customer' } },
  { path: 'issues/open-issue', component: Customer_OpenIssue, data: { title: 'Open Issue', role: 'customer' } },
  { path: 'issues/close-issue', component: Customer_CloseIssue, data: { title: 'Close Issue', role: 'customer' } },
];

@NgModule({
  imports: [RouterModule.forChild(customerRoutes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
