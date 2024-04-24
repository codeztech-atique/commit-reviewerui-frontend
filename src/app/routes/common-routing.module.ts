import { NgModule }                            from '@angular/core';
import { RouterModule, Routes }                from '@angular/router';

// Callback Component 

// User Login / Register
import { LoginPage }                         from '../auth/login/login';
import { RegisterPage }                      from '../auth/register/register';
import { ForgotPassword }                    from '../auth/forgot-password/forgot-password';
import { ChangePassword }                    from '../auth/change-Password/change-password';

const commonRoutes: Routes = [
  // Common Routes
  { path: '', component: LoginPage }, 
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'change-password', component: ChangePassword },
  { path: 'register', component: RegisterPage },
];

@NgModule({
  imports: [RouterModule.forChild(commonRoutes)],
  exports: [RouterModule]
})


export class CommonRoutingModule { }
