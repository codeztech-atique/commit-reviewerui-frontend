// Customer Routing Module 

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import other customer components here

// Customer Components

// Customer Dashboard
import { Customer_Dashboard } from '../components/customer/dashboard/dashboard';

// Customer Upload
import { Add_Account } from '../components/customer/accounts/add-account/add-account';
import { List_Commits } from '../components/customer/accounts/list-commits/list-commits';
import { Customer_CommitDetails } from '../components/customer/accounts/commit-details/commit-details';


const customerRoutes: Routes = [
  // Customer routes
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Customer_Dashboard, data: { title: 'Dashboard', role: 'customer' } },
  { path: 'account/add', component: Add_Account, data: { title: 'Add Account', role: 'customer' } },
  { path: 'commit/list', component: List_Commits, data: { title: 'List Commits', role: 'customer' } },
  { path: 'commit/:id/details', component: Customer_CommitDetails, data: { title: 'Commit Details', role: 'customer' } },
];

@NgModule({
  imports: [RouterModule.forChild(customerRoutes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
