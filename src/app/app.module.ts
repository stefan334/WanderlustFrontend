import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProfileComponent } from './profile/profile.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { UserFeedComponent } from './user-feed/user-feed.component';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ImageUploadComponent,
    ProfileComponent,
    UserSearchComponent,
    SearchModalComponent,
    UserFeedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
