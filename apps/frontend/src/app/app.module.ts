import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SigninComponent } from './components/signin/singin.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { AppRoutingModule } from './app-routing.module';
import { FlashMessageComponent } from './components/flash-message/flash-message.component';
import { AlertComponent } from './components/alert/alert.component';
import { TweetComponent } from './components/tweet/tweet.component';
import { DateAgoPipe } from './pipe/date-ago.pipe';
import { ReplyComponent } from './components/reply/reply.component';
import { DarkModeToggleComponent } from './components/dark-mode-toggle/dark-mode-toggle.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    NavComponent,
    FlashMessageComponent,
    AlertComponent,
    TweetComponent,
    DateAgoPipe,
    ReplyComponent,
    DarkModeToggleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
