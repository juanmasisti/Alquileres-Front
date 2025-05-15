import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule, routes } from './app-routing.module';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";


@NgModule({
  declarations: [    AppComponent
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes, { useHash: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    NavbarComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
