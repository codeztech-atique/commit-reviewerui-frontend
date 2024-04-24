import * as global                               from './config/globals';
import 'bootstrap';

import { APP_INITIALIZER } from '@angular/core';

// Core Module
import { HttpClientModule }                      from '@angular/common/http';
import { HTTP_INTERCEPTORS }                     from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DatePipe }                              from '@angular/common';
import { BrowserAnimationsModule }               from '@angular/platform-browser/animations';
import { BrowserModule, Title }                  from '@angular/platform-browser';
import { NgModule }                              from '@angular/core';
import { FormsModule, ReactiveFormsModule }      from '@angular/forms';
import { DataTablesModule }                      from 'angular-datatables';
import { DateAgoPipe }                           from './pipes/data-ago.pipe';
import { PickerModule }                          from '@ctrl/ngx-emoji-mart';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Routes

import { AppRoutingModule }                      from './routes/app-routing.module';

// Main Component
import { AppComponent }                    from './app.component';
import { HeaderComponent }                 from './layouts/header/header.component';
import { SidebarComponent }                from './layouts/sidebar/sidebar.component';

import { SidebarRightComponent }           from './layouts/sidebar-right/sidebar-right.component';
import { PanelComponent }                  from './layouts/panel/panel.component';
import { FloatSubMenuComponent }           from './layouts/float-sub-menu/float-sub-menu.component';

// Component Module
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CountdownModule }                          from 'ngx-countdown';
import { HighlightModule, HIGHLIGHT_OPTIONS }       from 'ngx-highlightjs';
import { NgApexchartsModule }              from 'ng-apexcharts';
import { FullCalendarModule }              from '@fullcalendar/angular';

import dayGridPlugin                       from '@fullcalendar/daygrid';
import timeGridPlugin                      from '@fullcalendar/timegrid';
import interactionPlugin                   from "@fullcalendar/interaction";
import listPlugin                          from '@fullcalendar/list';
import bootstrapPlugin                     from '@fullcalendar/bootstrap';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
  listPlugin,
  bootstrapPlugin
]);

import { LoadingBarRouterModule }          from '@ngx-loading-bar/router';
import { CalendarModule, DateAdapter }     from 'angular-calendar';
import { adapterFactory }                  from 'angular-calendar/date-adapters/date-fns';
import { TrendModule }                     from 'ngx-trend';
import { NgxDaterangepickerMd }            from 'ngx-daterangepicker-material';
import { NgxChartsModule }                 from '@swimlane/ngx-charts';
import { SweetAlert2Module }               from '@sweetalert2/ngx-sweetalert2';
import { NgxEditorModule }                 from 'ngx-editor';
import { ColorSketchModule }               from 'ngx-color/sketch';
import { NgxDatatableModule }              from '@swimlane/ngx-datatable';
import { PerfectScrollbarModule }          from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG }        from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// Customer Components
import { Customer_Dashboard }                 from './components/customer/dashboard/dashboard';

// Customer Upload
import { Add_Account }                from './components/customer/accounts/add-account/add-account';
import { List_Commits }             from './components/customer/accounts/list-commits/list-commits';
import { Customer_CommitDetails }               from './components/customer/accounts/commit-details/commit-details';


// User Login / Register
import { LoginPage }               from './auth/login/login';
import { RegisterPage }            from './auth/register/register';
import { ForgotPassword }          from './auth/forgot-password/forgot-password';
import { ChangePassword }          from './auth/change-Password/change-password';     
import { ToastComponent }          from './layouts/toast/toast.component'; 

// Services
import { SharedservicesService }     from './services/sharedservices.service';
import { ToastService }              from './services/toast.service';
import { IntroService }              from './services/intro.service';
import { CommonService }             from './services/common.service';

// Interceptor
import { JwtInterceptor }            from './_helpers/jwt.interceptor';
import { ErrorInterceptor }          from './_helpers/error.interceptor';

// Signin for sign in with google and facebook
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    // Common Components
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SidebarRightComponent,
    ToastComponent,
    PanelComponent,
    FloatSubMenuComponent,
    // ThemePanelComponent,
    DateAgoPipe,
   
    // Common Components
    LoginPage,
    RegisterPage,
    ForgotPassword,
    ChangePassword, 
    
    // Customer Components
    Customer_Dashboard,
    Add_Account,
    List_Commits,
    Customer_CommitDetails,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CountdownModule,
    ColorSketchModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    HighlightModule,
    LoadingBarRouterModule,
    NgbTooltipModule,
    NgApexchartsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgxDatatableModule,
    NgxEditorModule,
    NgxChartsModule,
    NgxDaterangepickerMd.forRoot(),
    PerfectScrollbarModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    TrendModule,
    DataTablesModule,
    PickerModule,
    SocialLoginModule
  ],
  providers: [ 
    DatePipe,
    SharedservicesService,
    IntroService,
    ToastService,
    CommonService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appRouting: AppRoutingModule) => () => appRouting.initialize(),
      deps: [AppRoutingModule],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    Title, 
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }, {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml')
        }
      }
    }, {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '249461109105-88jaj51i99v1di3ibldqd1fq5pujim4l.apps.googleusercontent.com',
              {
                oneTapEnabled: false,
              }
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('6761404970558917')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    } 
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule {
  constructor(private router: Router, private titleService: Title, private route: ActivatedRoute) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const firstChild = this.route.snapshot.firstChild;
        if (firstChild && firstChild.data && firstChild.data['title']) {
          const title = 'Zoom codeguard | ' + firstChild.data['title'];
          this.titleService.setTitle(title);
        }
      }
    });
  }
}
