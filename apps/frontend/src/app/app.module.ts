import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CreateTweetComponent } from './components/create-tweet/create-tweet.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SigninComponent } from './components/signin/singin.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { AppRoutingModule } from './app-routing.module';
import { FlashMessageComponent } from './components/flash-message/flash-message.component';
import { AlertComponent } from './components/alert/alert.component';
import { InputComponent } from './components/form/input/input.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateTweetComponent,
    SigninComponent,
    SignupComponent,
    HomeComponent,
    NavComponent,
    FlashMessageComponent,
    AlertComponent,
    InputComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
