import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule, routes } from './app-routing.module';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/interceptors/auth.interceptor';
import { RatingModule } from 'ngx-bootstrap/rating'
import { FormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from './custom-date-format';

@NgModule({
  declarations: [    AppComponent
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RatingModule,
    MatNativeDateModule,
    FormsModule,
    RouterModule.forRoot(routes, { useHash: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    NavbarComponent,
    HttpClientModule,
],
 providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
   },
   {
     provide: DateAdapter,
     useClass: MomentDateAdapter,
     deps: [MAT_MOMENT_DATE_ADAPTER_OPTIONS]
   },
   {
     provide: MAT_DATE_FORMATS,
     useValue: DATE_FORMATS
   }
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }
