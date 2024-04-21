// Common
import { NgModule, APP_INITIALIZER, ModuleWithProviders} from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ROLES } from '../config/roles';

// Authentication Service
import { AuthenticationService } from '../auth/authentication.service';


// Guard
import { AuthGuard } from '../guards/app.authguard';

// Routes

import { CommonRoutingModule }                   from './common-routing.module';
import { AdminRoutingModule }                    from './admin-routing.module';
import { CustomerRoutingModule }                 from './customer-routing.module';


// User Modal
import { Userdetails } from '../models/user.model';

var routes: Routes = [
   
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        CommonRoutingModule,
        AdminRoutingModule, 
        CustomerRoutingModule,
    ],
    exports: [RouterModule]
})


export class AppRoutingModule {
    currentUser: Userdetails;
    currentUserSubscription: Subscription;
    constructor(private authenticationService: AuthenticationService, private router: Router) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    public getRole():string {
        if (this.currentUser && this.currentUser['custom:role']) {
            return this.currentUser['custom:role'].toString();
        }

        // Return a default role or handle the case when the role is not available
        return ROLES.DEFAULT; // Replace ROLES.DEFAULT with your default role or logic
    }

    public loadRoleBasedRoutes(role: string): Routes {
        const routes: Routes = []; // Initialize routes array
        switch (role) {
          case ROLES.ADMIN:
            routes.push(
                {
                  path: 'admin',
                  canActivate: [AuthGuard],
                  loadChildren: () => import('./admin-routing.module').then((m) => m.AdminRoutingModule),
                },
            );
            break;
    
          case ROLES.CUSTOMER:
            routes.push(
                {
                  path: '',
                  canActivate: [AuthGuard],
                  loadChildren: () => import('./customer-routing.module').then((m) => m.CustomerRoutingModule),
                },
            );
            break;
         
          default:
            // Load CommonRoutingModule by default for unknown roles
            routes.push(
                {
                  path: '',
                  loadChildren: () => import('./common-routing.module').then((m) => m.CommonRoutingModule),
                },
            );
            break;
        }
        return routes;
    }

    static forRoot(): ModuleWithProviders<AppRoutingModule> {
        return {
          ngModule: AppRoutingModule,
          providers: [
            {
              provide: APP_INITIALIZER,
              useFactory: (appRouting: AppRoutingModule) => () =>
                appRouting.initialize(),
              deps: [AppRoutingModule],
              multi: true,
            },
          ],
        };
    }

    initialize(): Promise<void> {
        return new Promise<void>((resolve) => {

          const role = this.getRole();
          const routes = this.loadRoleBasedRoutes(role);
          this.router.resetConfig(routes);
          resolve();
        });
    }
}
